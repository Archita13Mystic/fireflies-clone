'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar';
import { MeetingCard } from '../components/meeting-card';
import { MeetingListItem } from '../types';
import { api } from '../lib/api';
import { 
  Calendar, 
  Upload, 
  Plus, 
  Play, 
  Settings, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  HelpCircle,
  Video,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { UploadModal } from '../components/upload-modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'ai_feed'>('recent');
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getMeetings(searchQuery, 'All', 'date_desc');
      setMeetings(data);
    } catch (err) {
      console.error('Failed loading dashboard meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleDeleteMeeting = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await api.deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed deleting meeting:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 relative">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        pageTitle="Home"
      />

      <main className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-8">
        {/* 1. Hero Gradient Welcome Section */}
        <div className="hero-gradient rounded-3xl p-8 border border-purple-100/60 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Aboard, Sagar!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fireflies is now ready to automate your meetings and streamline your workflows.
            </p>
          </div>

          {/* Video Preview Card */}
          <div className="bg-slate-900 rounded-2xl p-2.5 shadow-xl border border-slate-800 w-72 shrink-0 relative group cursor-pointer">
            <div className="bg-gradient-to-tr from-purple-950 to-indigo-900 rounded-xl h-36 flex items-center justify-center relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
              <span className="absolute top-2 left-2 text-[10px] font-semibold text-purple-200 bg-purple-950/60 px-2 py-0.5 rounded">
                Fireflies Product Demo
              </span>
            </div>
          </div>
        </div>

        {/* 2. Quick Start Cards Section */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Quick Start</h3>
            <p className="text-xs text-slate-500">Capture your first meeting or upload a recording to see Fireflies in action.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Schedule Meeting */}
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#FDF2F8] border border-pink-200/60 hover:border-pink-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs text-slate-800">Schedule Meeting</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition-colors" />
            </div>

            {/* Card 2: Upload File */}
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#ECFDF5] border border-emerald-200/60 hover:border-emerald-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs text-slate-800">Upload File</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>

            {/* Card 3: Capture Meeting */}
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#F3E8FF] border border-purple-200/60 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs text-slate-800">Capture Meeting</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </div>
        </div>

        {/* 3. Meetings List Section */}
        <div className="space-y-4">
          {/* Filter Pills Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'recent'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('ai_feed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'ai_feed'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                AI Feed
              </button>
            </div>

            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition-colors font-medium"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Meetings List */}
          {loading ? (
            <div className="py-12 text-center text-xs text-purple-600">
              Loading recent meetings...
            </div>
          ) : meetings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <p className="font-semibold text-sm text-slate-800">No recent meetings</p>
              <p className="text-xs text-slate-500">Upload a transcript or capture a call to view notes here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((m) => {
                const formattedDate = new Date(m.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={m.id}
                    className="bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all card-shadow hover:card-shadow-hover group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Purple "f" Icon Badge */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                        <span className="font-bold text-white text-sm font-mono">f</span>
                      </div>

                      <div>
                        <Link
                          href={`/meetings/${m.id}`}
                          className="font-semibold text-sm text-slate-900 group-hover:text-purple-600 transition-colors block"
                        >
                          {m.title}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formattedDate} • {Math.floor(m.duration_seconds / 60)} mins • {m.organizer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {m.category}
                      </span>

                      <Link
                        href={`/meetings/${m.id}`}
                        className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>View Notes</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteMeeting(m.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        title="Delete meeting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Floating Purple Help Button */}
      <button
        onClick={() => alert('Fireflies Help & Support Center')}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center shadow-xl shadow-purple-600/30 transition-transform active:scale-95 z-50"
        title="Help & Support"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(id) => router.push(`/meetings/${id}`)}
      />
    </div>
  );
}
