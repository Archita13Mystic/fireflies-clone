'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { Settings, User, Bell, Lock, Zap, Sliders, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar searchQuery="" onSearchChange={() => {}} onOpenUploadModal={() => {}} />

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span>Workspace & Profile Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your Fireflies workspace, AI bot preferences, and integrations.</p>
        </div>

        <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl divide-y divide-[#212E4A] shadow-xl">
          <div className="p-5 flex items-center justify-between hover:bg-[#1B2640]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">User Profile & Account</p>
                <p className="text-xs text-slate-400">Archita Sharma (archita@fireflies.ai)</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-[#1B2640]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Fred AI Assistant Preferences</p>
                <p className="text-xs text-slate-400">Configure auto-summary bullet styles and action item triggers</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-[#1B2640]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Notifications & Digest Email</p>
                <p className="text-xs text-slate-400">Manage post-meeting email notifications and Slack alerts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-[#1B2640]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Security & API Keys</p>
                <p className="text-xs text-slate-400">Manage personal access tokens and OAuth credentials</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </main>
    </div>
  );
}
