import React from "react";

interface TopicsChipsProps {
  topics: string[];
}

export default function TopicsChips({ topics }: TopicsChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic, idx) => (
        <span
          key={idx}
          className="rounded-full bg-[#2a2a3a] border border-[#7c5cfc]/30 text-white text-xs px-3 py-1 font-medium hover:border-[#7c5cfc] hover:bg-[#35354a] transition-all cursor-default"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}
