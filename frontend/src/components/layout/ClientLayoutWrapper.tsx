"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggle = () => {
    // On small screens, toggle drawer; on desktop, toggle collapsed state
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="h-full flex min-h-screen bg-[#0f0f13]">
      {/* Sidebar with open/close state */}
      <Sidebar
        isOpen={mobileDrawerOpen}
        setIsOpen={setMobileDrawerOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Core Shell with dynamic left padding based on sidebar state */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ${
          sidebarCollapsed ? "sm:pl-16" : "sm:pl-[240px]"
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          isCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggle}
        />

        {/* Main scrollable body area */}
        <main className="flex-1 overflow-y-auto pt-16 h-full min-w-0 bg-[#0f0f13]">
          {children}
        </main>
      </div>
    </div>
  );
}
