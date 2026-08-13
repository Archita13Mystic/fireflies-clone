'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Bot, 
  Video, 
  Activity, 
  Upload, 
  Layers, 
  BarChart2, 
  Users, 
  Star, 
  Settings, 
  MoreHorizontal,
  Flame
} from 'lucide-react';

interface SidebarProps {
  onOpenUploadModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUploadModal }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Ask Fred (AI)', icon: Bot, href: '/' },
    { name: 'Meetings', icon: Video, href: '/' },
    { name: 'Soundbites', icon: Activity, href: '/' },
    { name: 'Upload', icon: Upload, onClick: onOpenUploadModal },
    { name: 'Integrations', icon: Layers, href: '/' },
    { name: 'Analytics', icon: BarChart2, href: '/' },
    { name: 'Team', icon: Users, href: '/' },
    { name: 'Favorites', icon: Star, href: '/' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 h-screen sticky top-0 z-40 select-none shadow-sm">
      {/* Brand Logo "f" */}
      <Link href="/" className="mb-6 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
          <span className="font-extrabold text-white text-lg font-mono">f</span>
        </div>
      </Link>

      {/* Vertical Icon Menu */}
      <nav className="flex-1 w-full flex flex-col items-center space-y-2 overflow-y-auto px-2">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href && item.name === 'Home';
          const Icon = item.icon;

          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-all group relative"
                title={item.name}
              >
                <Icon className="w-5 h-5" />
                <span className="absolute left-14 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href || '/'}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${
                isActive
                  ? 'bg-purple-50 text-purple-600 border border-purple-200 font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
              title={item.name}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
              <span className="absolute left-14 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* More Options */}
      <div className="pt-2 border-t border-slate-100 w-full flex justify-center">
        <button className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 flex items-center justify-center">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
