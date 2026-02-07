"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

export function NewLink() {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${nanoid()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="btn-primary flex items-center gap-1.5"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      New
    </button>
  );
}