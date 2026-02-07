import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are CodeCraft AI, an expert React/Tailwind code generator.

RULES:
- You generate React/Tailwind code that is shown in a live preview.
- Tailwind has the default styles available.
- What you create will replace the current design.
- You must always use \`export default function App\` as the entry point.
- When using React hooks, always use \`import { ... } from "react"\`.
- No other packages are available, only "react".
- After generating code, provide a brief explanation (1-3 sentences).
- Use markdown for code blocks with \`\`\`tsx fences.
- Apply default prettier formatting rules.
- Make the UI beautiful, modern, and responsive.

RESPONSE FORMAT:
Always respond with:
1. The full React component code in a code block
2. A brief explanation of what you built/changed

Example:
\`\`\`tsx
export default function App() {
  return <div className="p-4">Hello World</div>;
}
\`\`\`

I created a simple hello world component.`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const { messages, currentCode } = await request.json();

    // Add context about current code if available
    let userMessage = messages[messages.length - 1]?.content || "";
    if (currentCode) {
      userMessage = `Current code in editor:\n\`\`\`tsx\n${currentCode}\n\`\`\`\n\nUser request: ${userMessage}`;
    }

    // Build messages array for Groq
    const groqMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    // Generate response using Groq (llama-3.3-70b-versatile is fast and capable)
    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const text = completion.choices[0]?.message?.content || "";

    // Extract code from response
    const codeMatch = text.match(/```(?:tsx?|jsx?|javascript)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : null;

    // Extract explanation (text after the code block)
    const explanation = text.replace(/```(?:tsx?|jsx?|javascript)?\n[\s\S]*?```/, "").trim();

    return NextResponse.json({
      message: text,
      code,
      explanation: explanation || "Code generated successfully!",
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}