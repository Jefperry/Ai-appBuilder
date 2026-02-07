"use client";

import Link from "next/link";
import { ErrorBoundary } from "react-error-boundary";
import { ClientSideSuspense, useAiChat } from "@liveblocks/react";

import { NewLink } from "./new-link";

export function Header({ chatId }: { chatId: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-craft-bg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span className="font-semibold text-gradient">
            CodeCraft
          </span>
        </Link>
        
        <span className="text-craft-border">/</span>
        
        <ErrorBoundary fallback={<div className="text-red-400 text-sm">Error loading title</div>}>
          <ClientSideSuspense
            fallback={
              <div className="h-6 rounded-md w-24 bg-craft-surface animate-pulse"></div>
            }
          >
            <Title chatId={chatId} />
          </ClientSideSuspense>
        </ErrorBoundary>
      </div>
      
      <div className="flex items-center gap-2">
        <ShareButton chatId={chatId} />
        <NewLink />
      </div>
    </div>
  );
}

// Title is automatically generated from the first message and reply
function Title({ chatId }: { chatId: string }) {
  const { chat } = useAiChat(chatId);

  return (
    <div className="text-sm font-medium text-slate-300 truncate max-w-[200px]">
      {chat?.title || "Untitled"}
    </div>
  );
}

function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied! Share it with anyone to collaborate.");
  };

  return (
    <button
      onClick={handleShare}
      className="btn-secondary flex items-center gap-1.5"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </button>
  );
}