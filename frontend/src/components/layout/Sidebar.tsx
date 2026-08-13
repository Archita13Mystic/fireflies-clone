import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  Video,
  Activity,
  Upload,
  Plug,
  BarChart2,
  Mic,
  Sparkles,
  Users,
  Star,
  Shield,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { getInitials } from "../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Meetings", icon: Video, href: "/meetings" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Integrations", icon: Plug, href: "/integrations" },
    { label: "Topics", icon: Activity, href: "/topics" },
    { label: "Voice Agents", icon: Mic, href: "/#", badge: "NEW" },
    { label: "AI Skills", icon: Sparkles, href: "/#" },
    { label: "AskFred", icon: MessageSquare, href: "/#", shortcut: "Ctrl+J" },
    { label: "Team", icon: Users, href: "/#" },
    { label: "Upgrade Plan", icon: Star, href: "/#" },
  ];

  const activeHref = (item: typeof navItems[0]) => {
    if (item.href === "/") return pathname === "/";
    if (item.href === "/meetings") return pathname.startsWith("/meetings");
    if (item.href === "/settings") return pathname.startsWith("/settings");
    if (item.href === "/integrations") return pathname.startsWith("/integrations");
    if (item.href === "/topics") return pathname.startsWith("/topics");
    return false;
  };

  const FullSidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-[#16161e] border-r border-[#2a2a3a] text-white">
      {/* Top Header */}
      <div className="flex-1 overflow-y-auto pt-2 scrollbar-thin scrollbar-thumb-[#2a2a3a]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a3a] mb-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c5cfc] shadow-md shadow-[#7c5cfc]/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              fireflies<span className="text-[#7c5cfc]">.ai</span>
            </span>
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#9090a0] hover:text-white hover:bg-[#252535] transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1 px-3">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = activeHref(item);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#7c5cfc]/15 text-[#7c5cfc] font-semibold border-l-2 border-[#7c5cfc]"
                    : "text-[#9090a0] hover:bg-[#1e1e2a] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] text-[#505060] bg-[#1a1a24] px-1.5 py-0.5 rounded border border-[#2a2a3a]">
                    {item.shortcut}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[9px] font-bold text-white bg-[#22c55e] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile section */}
      <div className="border-t border-[#2a2a3a] p-4 flex items-center justify-between bg-[#13131b] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c5cfc] text-sm font-bold text-white uppercase select-none shrink-0 shadow-sm">
            {getInitials("Archita Dubey")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Archita Dubey</p>
            <p className="truncate text-xs text-[#9090a0]">My Workspace</p>
          </div>
        </div>
      </div>
    </div>
  );

  const MiniSidebarContent = () => (
    <div className="flex h-full flex-col justify-between items-center py-4 bg-[#16161e] border-r border-[#2a2a3a] text-white">
      <div className="flex flex-col items-center gap-5">
        <Link href="/" className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#7c5cfc] shadow-md shadow-[#7c5cfc]/20">
          <Sparkles className="h-5 w-5 text-white" />
        </Link>

        {/* Expand toggle */}
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-lg text-[#9090a0] hover:text-white hover:bg-[#252535] transition-colors"
          title="Expand Sidebar"
        >
          <PanelLeftOpen size={18} />
        </button>

        <nav className="flex flex-col gap-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = activeHref(item);
            return (
              <Link
                key={idx}
                href={item.href}
                title={item.label}
                className={`p-2.5 rounded-lg transition-colors relative ${
                  active ? "bg-[#7c5cfc]/20 text-[#7c5cfc]" : "text-[#9090a0] hover:bg-[#1e1e2a] hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.badge && (
                  <span className="absolute 1 top-1 right-1 h-2 w-2 rounded-full bg-[#22c55e]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c5cfc] text-xs font-bold text-white shadow-sm">
        AD
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Large Screens: Collapsible Sidebar */}
      <aside
        className={`fixed bottom-0 top-0 left-0 hidden z-30 transition-all duration-300 sm:block ${
          isCollapsed ? "w-16" : "w-[240px]"
        }`}
      >
        {isCollapsed ? <MiniSidebarContent /> : <FullSidebarContent />}
      </aside>

      {/* Mobile Drawer (visible on screens < 640px) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative flex w-[260px] flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
            <FullSidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
