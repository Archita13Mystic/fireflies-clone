"use client";

import React from "react";
import { Plug } from "lucide-react";

const INTEGRATIONS = [
  {
    name: "Zoom",
    description: "Record and transcribe Zoom meetings automatically",
    icon: "🎥",
    color: "#2D8CFF",
  },
  {
    name: "Google Meet",
    description: "Join Google Meet calls and capture notes in real-time",
    icon: "📹",
    color: "#34A853",
  },
  {
    name: "Slack",
    description: "Send meeting summaries and action items to Slack channels",
    icon: "💬",
    color: "#4A154B",
  },
  {
    name: "Salesforce",
    description: "Sync call notes and action items to your CRM contacts",
    icon: "☁️",
    color: "#00A1E0",
  },
  {
    name: "HubSpot",
    description: "Attach meeting summaries to HubSpot deal records",
    icon: "🧡",
    color: "#FF7A59",
  },
  {
    name: "Notion",
    description: "Export meeting notes to Notion pages automatically",
    icon: "📝",
    color: "#FFFFFF",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-white">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-sm text-[#9090a0]">
          Connect Fireflies with your favorite tools — Coming Soon
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {INTEGRATIONS.map((integration) => (
          <div
            key={integration.name}
            className="flex items-start justify-between gap-4 rounded-lg border border-[#2a2a3a] bg-[#1e1e2a] p-5 hover:border-[#3a3a50] transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Icon Circle */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-2xl shrink-0"
                style={{ backgroundColor: `${integration.color}20`, border: `1px solid ${integration.color}30` }}
              >
                {integration.icon}
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white">{integration.name}</h4>
                <p className="mt-0.5 text-xs text-[#9090a0] leading-relaxed">
                  {integration.description}
                </p>
              </div>
            </div>

            <button
              disabled
              className="shrink-0 mt-1 rounded-md bg-[#2a2a3a] px-3 py-1.5 text-xs font-semibold text-[#9090a0] cursor-not-allowed border border-[#2a2a3a] flex items-center gap-1.5"
            >
              <Plug size={12} />
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
