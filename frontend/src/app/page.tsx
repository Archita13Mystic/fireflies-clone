"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Upload,
  Video,
  Play,
  Settings,
  Trash2,
  Tv,
  Smartphone,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { api } from "../lib/api";
import { Meeting } from "../lib/types";
import { formatDate, formatDuration } from "../lib/utils";
import CreateMeetingModal from "../components/meetings/CreateMeetingModal";
import DeleteConfirmModal from "../components/meetings/DeleteConfirmModal";
import toast from "react-hot-toast";

type TabType = "recent" | "upcoming" | "feed";

export default function DashboardHome() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMeetings("", "date_desc", "");
      setMeetings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard meetings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDeleteClick = (meeting: Meeting, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMeeting(meeting);
    setDeleteOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto text-white">
      {/* 1. Gradient Hero Banner */}
      <div className="hero-gradient rounded-2xl p-8 border border-white/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-3 text-slate-900">
          <h2 className="text-2xl font-bold tracking-tight">Welcome Aboard, John!</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Fireflies is now ready to automate your meetings and streamline your workflows.
          </p>
        </div>

        {/* Video Preview Card */}
        <div className="bg-slate-950 rounded-xl p-2 shadow-2xl border border-slate-800 w-72 shrink-0 relative group cursor-pointer transition-transform hover:scale-[1.02]">
          <div className="bg-gradient-to-tr from-purple-950 to-indigo-900 rounded-lg h-36 flex items-center justify-center relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-purple-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            </div>
            <span className="absolute top-2 left-2 text-[10px] font-bold text-purple-200 bg-purple-950/60 px-2.5 py-0.5 rounded">
              Fireflies Product Demo
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Start Cards Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-base text-white">Quick Start</h3>
          <p className="text-xs text-[#9090a0]">Capture your first meeting or upload a recording to see Fireflies in action.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Schedule Meeting */}
          <div
            onClick={() => setCreateOpen(true)}
            className="bg-[#fdf2f8]/10 hover:bg-[#fdf2f8]/15 border border-[#fbcfe8]/20 hover:border-[#fbcfe8]/40 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#fdf2f8] text-[#ec4899] shrink-0">
                <Calendar size={20} />
              </div>
              <span className="font-semibold text-sm text-white group-hover:text-[#7c5cfc] transition-colors">Schedule Meeting</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9090a0] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Card 2: Upload File */}
          <div
            onClick={() => setCreateOpen(true)}
            className="bg-[#ecfdf5]/10 hover:bg-[#ecfdf5]/15 border border-[#a7f3d0]/20 hover:border-[#a7f3d0]/40 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#ecfdf5] text-[#22c55e] shrink-0">
                <Upload size={20} />
              </div>
              <span className="font-semibold text-sm text-white group-hover:text-[#7c5cfc] transition-colors">Upload File</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9090a0] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Card 3: Capture Meeting */}
          <div
            onClick={() => setCreateOpen(true)}
            className="bg-[#f3e8ff]/10 hover:bg-[#f3e8ff]/15 border border-[#c084fc]/20 hover:border-[#c084fc]/40 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#f3e8ff] text-[#a855f7] shrink-0">
                <Video size={20} />
              </div>
              <span className="font-semibold text-sm text-white group-hover:text-[#7c5cfc] transition-colors">Capture Meeting</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9090a0] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Meetings List Section */}
      <div className="space-y-4">
        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-3">
          <div className="flex items-center gap-2 p-1 bg-[#16161e] border border-[#2a2a3a] rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === "recent"
                  ? "bg-[#7c5cfc] text-white"
                  : "text-[#9090a0] hover:text-white"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === "upcoming"
                  ? "bg-[#7c5cfc] text-white"
                  : "text-[#9090a0] hover:text-white"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === "feed"
                  ? "bg-[#7c5cfc] text-white"
                  : "text-[#9090a0] hover:text-white"
              }`}
            >
              AI Feed
            </button>
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-1.5 text-xs text-[#9090a0] hover:text-white transition-colors font-medium border border-[#2a2a3a] px-3 py-1.5 rounded-lg bg-[#16161e]/50 hover:bg-[#16161e]"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>

        {/* Content list */}
        {activeTab !== "recent" ? (
          <div className="bg-[#1e1e2a]/30 border border-[#2a2a3a] rounded-xl p-8 text-center text-[#9090a0]">
            <p className="text-sm font-semibold">Coming Soon</p>
            <p className="text-xs mt-1">This section will list your schedule and feed integrations.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-16 w-full bg-[#1e1e2a] border border-[#2a2a3a] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-[#1e1e2a]/30 border border-[#2a2a3a] rounded-xl p-8 text-center text-[#9090a0]">
            <p className="text-sm font-semibold">No recent meetings</p>
            <p className="text-xs mt-1">Configure your calendars or import files to begin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((m) => (
              <div
                key={m.id}
                onClick={() => router.push(`/meetings/${m.id}`)}
                className="bg-[#1e1e2a] border border-[#2a2a3a] hover:border-[#7c5cfc]/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm select-none"
              >
                <div className="flex items-center gap-4">
                  {/* Brand gradient icon */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 flex items-center justify-center shrink-0 shadow-md">
                    <span className="font-extrabold text-white text-base font-mono">f</span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-white group-hover:text-[#7c5cfc] transition-colors leading-snug">
                      {m.title}
                    </h4>
                    <p className="text-xs text-[#9090a0] mt-1">
                      {formatDate(m.date)} • {formatDuration(m.duration)} • {m.participants.length} {m.participants.length === 1 ? "participant" : "participants"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  {m.has_summary && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7c5cfc]/10 text-[#7c5cfc] border border-[#7c5cfc]/20 uppercase">
                      AI Note
                    </span>
                  )}

                  <Link
                    href={`/meetings/${m.id}`}
                    className="py-1.5 px-3 rounded-lg bg-[#7c5cfc] hover:bg-[#6c4cf2] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                  >
                    <Play size={12} className="fill-current" />
                    <span>View Notes</span>
                  </Link>

                  <button
                    onClick={(e) => handleDeleteClick(m, e)}
                    className="text-[#9090a0] hover:text-red-400 p-1.5 rounded hover:bg-[#2a2a3a]/50 transition-colors shrink-0"
                    title="Delete meeting"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Try More Apps Section */}
      <div className="space-y-4 pt-4 border-t border-[#2a2a3a]">
        <div>
          <h3 className="font-bold text-base text-white">Try More</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Desktop App */}
          <div className="bg-[#1e1e2a]/50 border border-[#2a2a3a] rounded-xl p-5 flex items-start gap-4 hover:border-[#3a3a50] transition-colors">
            <div className="p-3 bg-[#7c5cfc]/10 text-[#7c5cfc] rounded-xl shrink-0">
              <Tv size={24} />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h4 className="font-bold text-sm text-white">Desktop App</h4>
                <p className="text-xs text-[#9090a0] mt-0.5 leading-relaxed">
                  Capture conversations without any bot present in your meeting.
                </p>
              </div>
              <button
                disabled
                className="py-1.5 px-4 bg-[#2a2a3a] text-xs font-semibold text-[#9090a0] rounded-md cursor-not-allowed border border-[#2a2a3a]"
              >
                Download
              </button>
            </div>
          </div>

          {/* Mobile App */}
          <div className="bg-[#1e1e2a]/50 border border-[#2a2a3a] rounded-xl p-5 flex items-start gap-4 hover:border-[#3a3a50] transition-colors">
            <div className="p-3 bg-[#22c55e]/10 text-[#22c55e] rounded-xl shrink-0">
              <Smartphone size={24} />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h4 className="font-bold text-sm text-white">Mobile App</h4>
                <p className="text-xs text-[#9090a0] mt-0.5 leading-relaxed">
                  Record in-person conversations and review meetings on the go.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-[#2a2a3a] text-[#9090a0] px-2.5 py-1 rounded font-bold uppercase select-none border border-[#2a2a3a]">
                  iOS
                </span>
                <span className="text-[10px] bg-[#2a2a3a] text-[#9090a0] px-2.5 py-1 rounded font-bold uppercase select-none border border-[#2a2a3a]">
                  Android
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Modals */}
      <CreateMeetingModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchMeetings}
      />

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        meeting={selectedMeeting}
        onSuccess={fetchMeetings}
      />
    </div>
  );
}
