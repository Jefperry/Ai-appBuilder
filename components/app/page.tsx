"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "@liveblocks/core";
import NeuralBackground from "@/components/ui/flow-field-background";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

const suggestions = [
  "Create a website",
  "Build a counter app",
  "Design a dashboard",
];

export default function Home() {
  const router = useRouter();

  const handleSend = (message: string) => {
    const chatId = nanoid();
    if (message.trim()) {
      sessionStorage.setItem(`initial-prompt-${chatId}`, message);
    }
    router.push(`/${chatId}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Neural Flow Field Background */}
      <div className="absolute inset-0">
        <NeuralBackground 
          color="#6366f1"
          trailOpacity={0.1}
          particleCount={600}
          speed={0.8}
        />
      </div>

      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-craft-bg/50 to-craft-bg/80 pointer-events-none" />
      
      {/* Animated Logo */}
      <div className="logo-icon mb-8 relative z-10">
        <div className="logo-ring logo-ring-1" />
        <div className="logo-ring logo-ring-2" />
        <div className="logo-ring logo-ring-3" />
        <div className="logo-center">
          <svg className="w-6 h-6 text-craft-bg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Hero text */}
      <h1 className="text-4xl md:text-5xl font-semibold text-center mb-8 tracking-tight relative z-10">
        What do you want to build?
      </h1>

      {/* Suggestion pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 relative z-10">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSend(suggestion)}
            className="px-5 py-2.5 rounded-full glass text-sm text-slate-300 hover:text-accent hover:border-accent/50 transition-all duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Main input */}
      <div className="w-full max-w-xl relative z-10">
        <PromptInputBox
          onSend={handleSend}
          placeholder="What do you want to build?"
        />
      </div>

      {/* View history link */}
      <a 
        href="/chats" 
        className="mt-8 text-sm text-slate-500 hover:text-accent transition-colors flex items-center gap-1 relative z-10"
      >
        View chat history
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
