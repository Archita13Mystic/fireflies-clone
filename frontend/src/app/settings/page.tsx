"use client";

import React from "react";
import { getInitials } from "../../lib/utils";

const TOGGLES = [
  { label: "Email summaries", description: "Receive meeting summaries via email after every call" },
  { label: "Meeting reminders", description: "Get notified 15 minutes before a scheduled meeting" },
  { label: "Action item alerts", description: "Daily digest of open action items assigned to you" },
];

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      {/* Profile Section */}
      <div className="rounded-lg border border-[#2a2a3a] bg-[#1e1e2a] p-6 space-y-5">
        <h2 className="text-sm font-bold text-[#9090a0] uppercase tracking-widest">Profile</h2>

        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7c5cfc] text-xl font-bold text-white shrink-0">
            {getInitials("John Doe")}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white">John Doe</p>
            <p className="text-sm text-[#9090a0] mt-0.5">john@example.com</p>
          </div>

          <button
            disabled
            className="rounded-md px-4 py-2 bg-[#2a2a3a] text-sm font-semibold text-[#9090a0] cursor-not-allowed border border-[#2a2a3a]"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a3a]" />

      {/* Workspace Section */}
      <div className="rounded-lg border border-[#2a2a3a] bg-[#1e1e2a] p-6 space-y-3">
        <h2 className="text-sm font-bold text-[#9090a0] uppercase tracking-widest">Workspace</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">My Workspace</p>
            <p className="text-xs text-[#9090a0] mt-0.5">Personal workspace — 1 member</p>
          </div>
          <button
            disabled
            className="rounded-md px-4 py-2 bg-[#2a2a3a] text-sm font-semibold text-[#9090a0] cursor-not-allowed border border-[#2a2a3a]"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a3a]" />

      {/* Notifications Section */}
      <div className="rounded-lg border border-[#2a2a3a] bg-[#1e1e2a] p-6 space-y-5">
        <h2 className="text-sm font-bold text-[#9090a0] uppercase tracking-widest">Notifications</h2>

        <div className="space-y-4 divide-y divide-[#2a2a3a]">
          {TOGGLES.map((toggle) => (
            <div key={toggle.label} className="flex items-center justify-between pt-4 first:pt-0 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{toggle.label}</p>
                <p className="text-xs text-[#9090a0] mt-0.5">{toggle.description}</p>
              </div>

              {/* Disabled toggle switch */}
              <div className="relative shrink-0">
                <div className="h-5 w-10 rounded-full bg-[#2a2a3a] border border-[#2a2a3a] cursor-not-allowed" />
                <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-[#505060] shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
