'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar';
import { MeetingCard } from '../components/meeting-card';
import { MeetingListItem, MeetingStats } from '../types';
import { api } from '../lib/api';
import { Video, Clock, CheckCircle2, Sparkles, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';
import { UploadModal } from '../components/upload-modal';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [stats, setStats] = useState<MeetingStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsData, statsData] = await Promise.all([
        api.getMeetings(searchQuery, selectedCategory, sortBy),
        api.getMeetingStats()
      ]);
      setMeetings(meetingsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed loading dashboard meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, sortBy]);

  const handleDeleteMeeting = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await api.deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      loadData();
    } catch (err) {
      console.error('Failed deleting meeting:', err);
    }
  };

  const categories = ['All', 'Product', 'Engineering', 'Customer', 'Executive', 'Design'];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#131B2E] via-[#1B2640] to-[#0D1322] border border-[#212E4A] p-6 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Workspace Library
              </span>
              <span className="text-xs text-slate-400">• Welcome back, Archita</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Meeting Library & Transcripts</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Browse past meeting recordings, interactive transcripts, AI-extracted action items, and executive summaries.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add / Upload Meeting</span>
          </button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131B2E] border border-[#212E4A] p-4 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Total Meetings</p>
                <p className="text-xl font-bold text-white">{stats.total_meetings}</p>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-[#212E4A] p-4 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Transcribed Time</p>
                <p className="text-xl font-bold text-white">{stats.total_duration_hours} hrs</p>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-[#212E4A] p-4 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Pending Action Items</p>
                <p className="text-xl font-bold text-white">{stats.pending_action_items}</p>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-[#212E4A] p-4 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">AI Insights Active</p>
                <p className="text-xl font-bold text-white">100%</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#131B2E] border border-[#212E4A] p-3 rounded-2xl">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 ml-1 mr-1 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'bg-[#0D1322] border border-[#212E4A] text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0D1322] border border-[#212E4A] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="date_desc">Most Recent</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="duration_desc">Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Meetings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-indigo-400 text-xs gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading meetings library...</span>
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-[#131B2E] border border-[#212E4A] rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-3">
            <Video className="w-12 h-12 text-indigo-400 mx-auto opacity-80" />
            <h3 className="font-semibold text-base text-white">No meetings found</h3>
            <p className="text-xs text-slate-400">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try clearing your search or category filters.'
                : 'Upload or add your first meeting transcript to get started.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setIsUploadModalOpen(true);
              }}
              className="py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add First Meeting</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} onDelete={handleDeleteMeeting} />
            ))}
          </div>
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(id) => router.push(`/meetings/${id}`)}
      />
    </div>
  );
}
