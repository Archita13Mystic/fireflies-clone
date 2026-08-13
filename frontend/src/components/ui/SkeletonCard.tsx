import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-lg border border-[#2a2a3a] bg-[#1e1e2a] p-5 space-y-4 animate-pulse">
      {/* Title */}
      <div className="h-5 bg-[#2a2a3a] rounded w-3/4"></div>

      {/* Date / Duration */}
      <div className="flex gap-4">
        <div className="h-4 bg-[#252535] rounded w-1/4"></div>
        <div className="h-4 bg-[#252535] rounded w-1/5"></div>
      </div>

      {/* Avatars */}
      <div className="flex -space-x-1.5 pt-2">
        <div className="w-7 h-7 rounded-full bg-[#2a2a3a]"></div>
        <div className="w-7 h-7 rounded-full bg-[#252535]"></div>
        <div className="w-7 h-7 rounded-full bg-[#2a2a3a]"></div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a3a]/40 pt-3 flex justify-between items-center">
        <div className="h-4 bg-[#2a2a3a] rounded w-1/4"></div>
        <div className="h-5 bg-[#2a2a3a] rounded-full w-1/5"></div>
      </div>
    </div>
  );
}
