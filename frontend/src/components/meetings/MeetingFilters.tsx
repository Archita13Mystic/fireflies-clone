import React, { useEffect, useState } from "react";
import { Search, ChevronDown, User } from "lucide-react";

interface MeetingFiltersProps {
  onSearchChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onParticipantChange: (val: string) => void;
}

export default function MeetingFilters({
  onSearchChange,
  onSortChange,
  onParticipantChange,
}: MeetingFiltersProps) {
  const [searchVal, setSearchVal] = useState("");
  const [participantVal, setParticipantVal] = useState("");

  // 300ms debounce for search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchChange(searchVal);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal, onSearchChange]);

  // 300ms debounce for participant query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onParticipantChange(participantVal);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [participantVal, onParticipantChange]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#16161e]/50 p-4 rounded-lg border border-[#2a2a3a]">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9090a0]">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search meetings…"
          className="w-full h-10 rounded-md border border-[#2a2a3a] bg-[#16161e] pl-9 pr-4 text-sm text-white placeholder-[#505060] focus:border-[#7c5cfc] focus:outline-none transition-colors"
        />
      </div>

      {/* Participant Filter Input */}
      <div className="relative w-full sm:max-w-xs">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9090a0]">
          <User size={16} />
        </span>
        <input
          type="text"
          value={participantVal}
          onChange={(e) => setParticipantVal(e.target.value)}
          placeholder="Filter by participant…"
          className="w-full h-10 rounded-md border border-[#2a2a3a] bg-[#16161e] pl-9 pr-4 text-sm text-white placeholder-[#505060] focus:border-[#7c5cfc] focus:outline-none transition-colors"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative w-full sm:w-48">
        <select
          onChange={(e) => onSortChange(e.target.value)}
          defaultValue="date_desc"
          className="w-full h-10 rounded-md border border-[#2a2a3a] bg-[#16161e] px-3 py-2 text-sm text-white focus:border-[#7c5cfc] focus:outline-none appearance-none cursor-pointer pr-10"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="title_asc">A → Z</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#9090a0]">
          <ChevronDown size={16} />
        </span>
      </div>
    </div>
  );
}
