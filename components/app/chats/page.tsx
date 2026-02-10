"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { nanoid } from "@liveblocks/core";
import { useAiChats, useDeleteAiChat } from "@liveblocks/react";
import { Timestamp } from "@liveblocks/react-ui/primitives";

import { PlusIcon } from "@/components/icons/plus";
import { TrashIcon } from "@/components/icons/trash";

const STORAGE_KEY = "codecraft-chat-names";

/** Read custom chat names from localStorage */
function getCustomNames(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Save a custom name for a chat */
function saveCustomName(chatId: string, name: string) {
  const names = getCustomNames();
  if (name.trim()) {
    names[chatId] = name.trim();
  } else {
    delete names[chatId];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

/** Get the display name for a chat (custom name → Liveblocks title → "Untitled") */
function getDisplayName(chatId: string, liveblocksTitle: string, customNames: Record<string, string>): string {
  return customNames[chatId] || liveblocksTitle || "Untitled";
}

function NewChatButton({ className }: { className?: string }) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/${nanoid()}`);
  };

  return (
    <button onClick={handleClick} className={className}>
      <PlusIcon className="opacity-80" />
      New chat
    </button>
  );
}

export default function Chats() {
  const { chats } = useAiChats();
  const deleteAiChat = useDeleteAiChat();
  const [query, setQuery] = useState("");
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Load custom names from localStorage on mount
  useEffect(() => {
    setCustomNames(getCustomNames());
  }, []);

  // Focus the edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const startEditing = useCallback((chatId: string, currentName: string) => {
    setEditingId(chatId);
    setEditValue(currentName);
  }, []);

  const confirmEdit = useCallback(() => {
    if (editingId) {
      saveCustomName(editingId, editValue);
      setCustomNames(getCustomNames());
      setEditingId(null);
      setEditValue("");
    }
  }, [editingId, editValue]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  // Filter chats by display name (custom name → title → "Untitled")
  const filteredChats = useMemo(() => {
    if (!chats) return chats;

    const withDisplayNames = chats.map((chat) => ({
      ...chat,
      displayName: getDisplayName(chat.id, chat.title, customNames),
    }));

    if (!query) return withDisplayNames;

    return withDisplayNames.filter(({ displayName }) =>
      displayName.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, chats, customNames]);

  if (!chats || !filteredChats) {
    return (
      <div className="p-4 flex flex-col justify-center items-center h-full text-slate-400">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="mt-2">Loading…</span>
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4 relative">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="flex justify-center items-center flex-col max-w-sm text-center gap-2 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-craft-surface border border-craft-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="font-semibold text-lg text-white">Start your first conversation</p>
          <p className="text-slate-400 text-sm">
            Ask anything, explore ideas, or think out loud. Your chats will appear here.
          </p>
        </div>
        <NewChatButton className="btn-primary mt-6 relative z-10" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pt-12 max-w-[--inner-app-width] px-4 relative">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
      
      <div className="flex justify-between items-center relative z-10">
        <div>
          <Link href="/" className="text-accent text-sm hover:underline mb-1 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="font-semibold text-2xl tracking-tight text-white">
            Your chat history
          </h1>
        </div>
        <NewChatButton className="btn-primary" />
      </div>

      <input
        type="text"
        placeholder="Search your chats…"
        className="w-full py-2.5 px-4 bg-craft-surface border border-craft-border rounded-lg mt-6 mb-4 text-sm h-11 outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 placeholder:text-slate-500 text-white transition-all relative z-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-1.5 mb-3 text-slate-400 text-sm relative z-10">
        {query ? (
          <span>
            Found {filteredChats.length} chats matching "{query}"
          </span>
        ) : (
          <span>
            {chats.length} previous chat{chats.length > 1 && "s"}
          </span>
        )}
      </div>

      {filteredChats.length > 0 && (
        <ul className="flex flex-col gap-3 p-0 relative z-10">
          {filteredChats.map((chat) => {
            const isEditing = editingId === chat.id;
            return (
              <li
                key={chat.id}
                className="group list-none bg-craft-surface hover:bg-craft-card border border-craft-border hover:border-accent/50 px-5 py-4 rounded-xl flex justify-between isolate relative gap-2 transition-all duration-200 hover:shadow-glow"
              >
                {!isEditing && <Link href={`/${chat.id}`} className="absolute inset-0" />}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      onBlur={confirmEdit}
                      className="w-full text-sm text-white font-medium bg-craft-bg border border-accent rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-accent/50 z-20 relative"
                      placeholder="Chat name…"
                    />
                  ) : (
                    <div className="truncate text-sm text-white font-medium">
                      {chat.displayName}
                    </div>
                  )}
                  <div className="text-slate-500 text-xs mt-1">
                    Last message{" "}
                    <Timestamp date={chat.lastMessageAt || chat.createdAt} />
                  </div>
                </div>
                <div className="flex items-center gap-1 z-10">
                  {/* Edit button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isEditing) {
                        confirmEdit();
                      } else {
                        startEditing(chat.id, chat.displayName);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    title="Rename chat"
                  >
                    <svg className="w-4 h-4 text-slate-400 hover:text-accent hidden group-hover:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  {/* Delete button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteAiChat(chat.id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete chat"
                  >
                    <TrashIcon className="text-red-400 size-4 hidden group-hover:block" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}