"use client";

import React from "react";
import { Tag } from "lucide-react";

export default function TopicsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold tracking-tight">Topics</h1>

      <div className="flex flex-col items-center justify-center py-24 text-center bg-[#1e1e2a]/30 border border-[#2a2a3a] rounded-xl p-8 max-w-md mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7c5cfc]/10 text-[#7c5cfc] mb-4">
          <Tag size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Coming Soon</h3>
        <p className="text-sm text-[#9090a0]">
          Topic tracking and automatic category filtering will be available in a future update.
        </p>
      </div>
    </div>
  );
}
