import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Sparkles, PanelLeftOpen } from "lucide-react";
import { getInitials } from "../../lib/utils";

interface NavbarProps {
  isCollapsed?: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ isCollapsed = false, onToggleSidebar }: NavbarProps) {
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-20 h-16 border-b border-[#2a2a3a] bg-[#0f0f13]/90 backdrop-blur px-4 flex items-center justify-between gap-4 text-white transition-all duration-300 ${
        isCollapsed ? "sm:left-16" : "sm:left-[240px]"
      }`}
    >
      {/* Left side: toggle button + branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 hover:bg-[#252535] text-[#9090a0] hover:text-white transition-colors"
          title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
          aria-label="Toggle navigation menu"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-2 sm:hidden">
          <div className="h-7 w-7 flex items-center justify-center rounded bg-[#7c5cfc]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">fireflies</span>
        </div>
      </div>

      {/* Middle Spacer */}
      <div className="flex-1" />

      {/* Right side: Bell icon + user avatar */}
      <div className="flex items-center gap-4">
        <button
          className="relative rounded-full p-1.5 hover:bg-[#252535] text-[#9090a0] hover:text-white transition-colors"
          aria-label="View notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#7c5cfc]" />
        </button>

        <div className="h-8 w-8 items-center justify-center rounded-full bg-[#7c5cfc] text-xs font-bold text-white hidden sm:flex">
          {getInitials("Archita Dubey")}
        </div>
      </div>
    </header>
  );
}
