"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useStorage } from "@liveblocks/react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Build a counter app",
  "Create a login form",
  "Design a pricing card",
  "Make a todo list",
];

export default function Chat({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const code = useStorage((root) => root.code);
  const setCode = useMutation(({ storage }, newCode: string) => {
    storage.set("code", newCode);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentCode: code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update code if AI generated new code
      if (data.code) {
        setCode(data.code);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-craft-surface">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={sendMessage} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm">Generating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Prompt Input */}
      <div className="p-4 border-t border-craft-border">
        <PromptInputBox
          onSend={sendMessage}
          isLoading={isLoading}
          placeholder="Ask CodeCraft to build something..."
        />
      </div>
    </div>
  );
}

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-craft-surface border border-craft-border flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-white font-semibold mb-1">CodeCraft AI</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-[250px]">
        Describe what you want to build and I'll generate the code for you.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Try these</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-2.5 text-left rounded-xl bg-craft-card border border-craft-border text-sm text-slate-300 hover:text-accent hover:border-accent/50 hover:shadow-glow transition-all"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Simple markdown-like rendering for code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```(?:tsx?|jsx?|javascript)?\n?/g, "").replace(/```$/, "");
        return (
          <pre key={index} className="mt-2 p-3 bg-craft-bg rounded-lg overflow-x-auto text-xs font-mono">
            <code className="text-slate-300">{code}</code>
          </pre>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser
            ? "bg-accent text-craft-bg font-medium rounded-br-md"
            : "bg-craft-card border border-craft-border text-slate-200 rounded-bl-md"
        }`}
      >
        {isUser ? message.content : renderContent(message.content)}
      </div>
    </div>
  );
}