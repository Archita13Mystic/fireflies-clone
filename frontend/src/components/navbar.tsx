'use client';

import React, { useState } from 'react';
import { Search, Bell, Video, Mic, ChevronDown, Sparkles, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUploadModal: () => void;
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenUploadModal,
  pageTitle = 'Home',
}) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="w-full flex flex-col sticky top-0 z-30 bg-white">
      {/* Top Eligibility Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-b border-purple-100 px-4 py-2 flex items-center justify-between text-xs text-purple-950">
          <div className="flex-1 text-center font-medium flex items-center justify-center gap-1">
            <span>You are eligible for 7 days business plan free trial.</span>
            <a href="#" className="font-semibold text-purple-700 hover:underline flex items-center gap-0.5">
              <span>Start free trial</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Header Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        {/* Left Page Title */}
        <div className="w-48">
          <h1 className="font-semibold text-sm text-slate-800 tracking-tight">{pageTitle}</h1>
        </div>

        {/* Center Search Input with Ctrl + K */}
        <div className="relative w-96">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or keyword"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-16 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
            <span>Ctrl + K</span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Upgrade Green Button */}
          <button className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs transition-colors">
            Upgrade
          </button>

          {/* Capture Purple Dropdown Button */}
          <button
            onClick={onOpenUploadModal}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Capture</span>
            <ChevronDown className="w-3.5 h-3.5 text-purple-200 ml-0.5" />
          </button>

          {/* Mic Button */}
          <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            <Mic className="w-4 h-4" />
          </button>

          {/* Bell Notifications */}
          <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 border border-white"></span>
          </button>

          {/* User Avatar Circle "SK" */}
          <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-900 font-extrabold text-[11px] flex items-center justify-center shadow-sm cursor-pointer">
            SK
          </div>
        </div>
      </header>
    </div>
  );
};
