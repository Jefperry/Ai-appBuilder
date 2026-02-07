"use client";

import { useAiChatStatus } from "@liveblocks/react";

import { Room } from "./_components/room";
import { Editor } from "./_components/editor";
import { Header } from "./_components/header";
import Chat from "./_components/chat";
import { Preview } from "./_components/preview";
import { useState, use } from "react";

export default function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const [panel, setPanel] = useState<"preview" | "editor">("preview");
  const { status, toolName } = useAiChatStatus(chatId);
  const isGenerating = status === "generating" && toolName === "edit-code";

  return (
    <Room chatId={chatId}>
      <div className="flex flex-col h-full w-full gap-2.5 overflow-hidden p-2.5">
        <header>
          <Header chatId={chatId} />
        </header>

        <main className="grow flex min-h-0 gap-2.5">
          {/* Chat Panel */}
          <div className="grow-0 w-[380px] rounded-xl overflow-hidden bg-craft-surface border border-craft-border">
            <Chat chatId={chatId} />
          </div>

          {/* Editor/Preview Panel */}
          <div className="relative grow rounded-xl overflow-hidden border border-craft-border bg-craft-surface flex flex-col">
            {/* Tab Bar */}
            <div className="flex items-center justify-between px-4 border-b border-craft-border bg-craft-card">
              <div className="flex items-center py-2 gap-1">
                <button
                  className="text-sm font-medium py-1.5 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-craft-border/50 data-[selected]:text-white data-[selected]:bg-accent-purple/20 data-[selected]:text-accent-purple transition-all duration-200"
                  data-selected={panel === "preview" || undefined}
                  onClick={() => setPanel("preview")}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </span>
                </button>
                <button
                  className="text-sm font-medium py-1.5 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-craft-border/50 data-[selected]:text-white data-[selected]:bg-accent-purple/20 data-[selected]:text-accent-purple transition-all duration-200"
                  data-selected={panel === "editor" || undefined}
                  onClick={() => setPanel("editor")}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Editor
                  </span>
                </button>
              </div>
              
              {/* Status indicator */}
              {isGenerating ? (
                <div className="flex items-center gap-2 text-accent-purple text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
                  <span className="animate-pulse">Generating…</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Ready
                </div>
              )}
            </div>

            {/* Content */}
            <div className="grow relative bg-white">
              <div
                className="absolute inset-0"
                style={{
                  display: panel === "preview" ? "block" : "none",
                }}
              >
                <Preview chatId={chatId} />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  display: panel === "editor" ? "block" : "none",
                }}
              >
                <Editor chatId={chatId} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Room>
  );
}