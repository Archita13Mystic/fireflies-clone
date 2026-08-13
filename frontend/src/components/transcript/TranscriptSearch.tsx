import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface TranscriptSearchProps {
  onSearch: (query: string) => void;
  matchCount: number;
}

export default function TranscriptSearch({ onSearch, matchCount }: TranscriptSearchProps) {
  const [val, setVal] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(val.trim());
    }, 200);
    return () => clearTimeout(handler);
  }, [val, onSearch]);

  const handleClear = () => {
    setVal("");
    onSearch("");
  };

  return (
    <div className="flex items-center gap-3 bg-[#16161e] border border-[#2a2a3a] px-3 py-2 rounded-md group focus-within:border-[#7c5cfc] transition-colors">
      <Search size={16} className="text-[#9090a0] group-focus-within:text-[#7c5cfc] transition-colors" />
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Search transcript…"
        className="flex-1 bg-transparent text-sm text-white placeholder-[#505060] focus:outline-none"
      />
      {val && (
        <button
          onClick={handleClear}
          className="p-0.5 rounded-full hover:bg-[#252535] text-[#9090a0] hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      )}
      {val && (
        <span className="text-xs text-[#9090a0] border-l border-[#2a2a3a] pl-2 font-medium shrink-0">
          {matchCount} {matchCount === 1 ? "match" : "matches"}
        </span>
      )}
    </div>
  );
}
