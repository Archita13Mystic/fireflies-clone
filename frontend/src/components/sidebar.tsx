'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Video, 
  Sparkles, 
  Volume2, 
  Layers, 
  Settings, 
  HelpCircle, 
  PlusCircle, 
  Flame,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onOpenUploadModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUploadModal }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'My Meetings', icon: Video, href: '/', badge: 'Live' },
    { name: 'Ask Fred AI', icon: Sparkles, href: '#', tag: 'AI' },
    { name: 'Soundbites', icon: Volume2, href: '#' },
    { name: 'Integrations', icon: Layers, href: '#', comingSoon: true },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#0D1322] border-r border-[#212E4A] flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#212E4A]/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-wide flex items-center gap-1">
              Fireflies<span className="text-indigo-400">.ai</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Workspace</span>
          </div>
        </Link>
      </div>

      {/* New Meeting CTA */}
      <div className="p-4">
        <button
          onClick={onOpenUploadModal}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all hover:shadow-indigo-500/40 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload / Add Meeting</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href && item.href !== '#';
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
              {item.tag && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.tag}
                </span>
              )}
              {item.comingSoon && (
                <span className="text-[10px] text-slate-400 italic">Soon</span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Placeholders</div>
        <div className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-300 cursor-pointer flex items-center justify-between">
          <span>Live Call Notetaker Bot</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Mocked</span>
        </div>
        <div className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-300 cursor-pointer flex items-center justify-between">
          <span>Calendar Sync</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Mocked</span>
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#212E4A]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
            AS
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Archita Sharma</p>
            <p className="text-[10px] text-slate-400 truncate">archita@fireflies.ai</p>
          </div>
        </div>
        <Link href="/settings" className="text-slate-400 hover:text-white p-1" title="Settings">
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
};
