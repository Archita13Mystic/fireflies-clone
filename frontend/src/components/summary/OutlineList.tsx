import React from "react";
import { OutlineChapter } from "../../lib/types";
import { formatTimestamp } from "../../lib/utils";

interface OutlineListProps {
  outline: OutlineChapter[];
  onSeek: (time: number) => void;
}

export default function OutlineList({ outline, onSeek }: OutlineListProps) {
  if (outline.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#9090a0]">
        No outline available.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {outline.map((chapter, idx) => (
        <li
          key={idx}
          className="flex items-start justify-between gap-4 p-2.5 rounded hover:bg-[#252535]/50 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <span className="text-sm font-bold text-[#7c5cfc] select-none mt-0.5">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="text-sm text-white font-medium break-words leading-relaxed">
              {chapter.title}
            </span>
          </div>
          <button
            onClick={() => onSeek(chapter.start_time)}
            className="font-mono text-xs text-[#9090a0] hover:text-[#7c5cfc] hover:underline focus:outline-none bg-[#2a2a3a] px-2 py-0.5 rounded transition-all select-none shrink-0"
          >
            {formatTimestamp(chapter.start_time)}
          </button>
        </li>
      ))}
    </ul>
  );
}
