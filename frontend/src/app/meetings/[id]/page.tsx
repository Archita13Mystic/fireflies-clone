'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Download, 
  Share2, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Volume2, 
  Layers,
  RefreshCw
} from 'lucide-react';

import { MeetingDetail } from '../../../types';
import { api } from '../../../lib/api';
import { AudioPlayer } from '../../../components/audio-player';
import { TranscriptView } from '../../../components/transcript-view';
import { AISummary } from '../../../components/ai-summary';
import { ActionItemsList } from '../../../components/action-items';
import { AskFredChat } from '../../../components/ask-fred-chat';
import { ExportModal } from '../../../components/export-modal';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = Number(params?.id);

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Audio Playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Active Tab: 'summary' | 'action_items' | 'ask_fred' | 'soundbites'
  const [activeTab, setActiveTab] = useState<'summary' | 'action_items' | 'ask_fred' | 'soundbites'>('summary');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const loadMeeting = async () => {
    if (!meetingId) return;
    setLoading(true);
    try {
      const data = await api.getMeetingDetail(meetingId);
      setMeeting(data);
    } catch (err) {
      console.error('Failed loading meeting detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeeting();
  }, [meetingId]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await api.deleteMeeting(meetingId);
      router.push('/');
    } catch (err) {
      console.error('Failed deleting meeting:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-indigo-400 text-xs gap-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading meeting transcript & AI notes...</span>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex-1 p-12 text-center text-slate-400">
        <p className="text-base font-semibold text-white mb-2">Meeting not found</p>
        <Link href="/" className="text-xs text-indigo-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const durationMins = Math.floor(meeting.duration_seconds / 60);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Meeting Header */}
      <header className="bg-[#0D1322] border-b border-[#212E4A] px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#131B2E] border border-[#212E4A] text-slate-400 hover:text-white transition-colors shrink-0"
              title="Back to meetings"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {meeting.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {durationMins} mins
                </span>
              </div>

              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>{meeting.title}</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setIsExportOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-[#131B2E] border border-[#212E4A] hover:border-indigo-500/40 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Notes</span>
            </button>

            <button
              onClick={() => alert('Shareable workspace link copied to clipboard!')}
              className="py-2 px-3.5 rounded-xl bg-[#131B2E] border border-[#212E4A] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-[#131B2E] border border-[#212E4A] text-slate-400 hover:text-red-400 transition-colors"
              title="Delete meeting"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Synchronized Audio Player */}
        <AudioPlayer
          audioUrl={meeting.audio_url || '/samples/sample-meeting.mp3'}
          currentTime={currentTime}
          duration={meeting.duration_seconds}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Transcript (7 cols) */}
          <div className="lg:col-span-7 h-[680px]">
            <TranscriptView
              transcripts={meeting.transcripts}
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          </div>

          {/* Right Column: Tabbed AI Insights & Ask Fred Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Navigation Tabs Header */}
            <div className="flex items-center gap-1 p-1 bg-[#131B2E] border border-[#212E4A] rounded-xl text-xs font-medium overflow-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all shrink-0 ${
                  activeTab === 'summary'
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Summary</span>
              </button>

              <button
                onClick={() => setActiveTab('action_items')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all shrink-0 ${
                  activeTab === 'action_items'
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Action Items ({meeting.action_items.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ask_fred')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all shrink-0 ${
                  activeTab === 'ask_fred'
                    ? 'bg-purple-600 text-white font-semibold shadow'
                    : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Fred</span>
              </button>

              <button
                onClick={() => setActiveTab('soundbites')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all shrink-0 ${
                  activeTab === 'soundbites'
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Soundbites</span>
              </button>
            </div>

            {/* Active Tab Panel Content */}
            <div className="h-[610px] overflow-y-auto">
              {activeTab === 'summary' && (
                <AISummary summary={meeting.summary} onSeek={handleSeek} />
              )}

              {activeTab === 'action_items' && (
                <ActionItemsList
                  meetingId={meeting.id}
                  initialItems={meeting.action_items}
                  onItemsChange={(updated) => setMeeting({ ...meeting, action_items: updated })}
                />
              )}

              {activeTab === 'ask_fred' && (
                <AskFredChat meetingId={meeting.id} initialMessages={meeting.chat_messages} />
              )}

              {activeTab === 'soundbites' && (
                <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <span>Saved Soundbites & Snippets</span>
                  </h3>
                  {meeting.soundbites.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No soundbites saved yet for this meeting.</p>
                  ) : (
                    meeting.soundbites.map((sb) => (
                      <div
                        key={sb.id}
                        onClick={() => handleSeek(sb.start_time)}
                        className="p-3.5 rounded-xl bg-[#0D1322] border border-[#212E4A] hover:border-indigo-500/40 cursor-pointer transition-all space-y-1"
                      >
                        <p className="font-semibold text-xs text-white">{sb.title}</p>
                        <p className="text-xs text-slate-300 italic">"{sb.text}"</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ExportModal
        isOpen={isExportOpen}
        meetingId={meeting.id}
        title={meeting.title}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
