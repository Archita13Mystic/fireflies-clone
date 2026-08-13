import React from "react";
import { TranscriptLine as TranscriptLineType } from "../../lib/types";
import { formatTimestamp, getAvatarColor, getInitials } from "../../lib/utils";

interface TranscriptLineProps {
  line: TranscriptLineType;
  isActive: boolean;
  searchQuery: string;
  onTimestampClick: (time: number) => void;
}

export default function TranscriptLine({
  line,
  isActive,
  searchQuery,
  onTimestampClick,
}: TranscriptLineProps) {
  const speakerColor = getAvatarColor(line.speaker);

  // Helper function to render text with search query highlighted using <mark>
  const renderHighlightedText = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;

    const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-[#fbbf24] text-black px-0.5 rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      data-sequence={line.sequence}
      data-active={isActive ? "true" : "false"}
      className={`flex items-start gap-4 p-3 rounded-md transition-all select-text border-l-3 ${
        isActive
          ? "border-[#7c5cfc] bg-[#252535]"
          : "border-transparent hover:bg-[#1e1e2a]/50"
      }`}
    >
      {/* Speaker Avatar */}
      <div
        style={{ backgroundColor: speakerColor }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white uppercase select-none"
      >
        {getInitials(line.speaker)}
      </div>

      {/* Speaker content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 select-none">
          <span style={{ color: speakerColor }} className="text-xs font-bold truncate">
            {line.speaker}
          </span>
          <button
            onClick={() => onTimestampClick(line.start_time)}
            className="font-mono text-xs text-[#9090a0] hover:text-[#7c5cfc] hover:underline focus:outline-none"
          >
            {formatTimestamp(line.start_time)}
          </button>
        </div>
        <p className="text-sm text-white leading-relaxed break-words">
          {renderHighlightedText(line.text, searchQuery)}
        </p>
      </div>
    </div>
  );
}
