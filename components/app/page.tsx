"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "@liveblocks/core";

const suggestions = [
  "Create a website",
  "Build a mobile app",
  "Design a dashboard",
];

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chatId = nanoid();
    if (prompt.trim()) {
      sessionStorage.setItem(`initial-prompt-${chatId}`, prompt);
    }
    router.push(`/${chatId}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient glow - green */}
      <div className="absolute inset-0 bg-gradient-to-b from-craft-bg via-craft-bg to-craft-bg" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
      
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
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-5 py-2.5 rounded-full glass text-sm text-slate-300 hover:text-accent hover:border-accent/50 transition-all duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Main input */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl relative z-10">
        <div className="gradient-border">
          <div className="bg-craft-surface rounded-2xl p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a follow-up..."
              className="w-full bg-transparent text-white placeholder-slate-500 resize-none outline-none min-h-[60px] text-base"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-lg hover:bg-craft-card transition-colors text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button type="button" className="p-2 rounded-lg hover:bg-craft-card transition-colors text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </button>
                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-craft-card text-sm text-slate-300 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Builder
                </button>
              </div>
              <button
                type="submit"
                className="p-2.5 rounded-lg bg-accent text-craft-bg hover:shadow-glow transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>

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
