'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Bookmark, Copy, Check, Filter } from 'lucide-react';
import { Transcript } from '../types';

interface TranscriptViewProps {
  transcripts: Transcript[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcripts,
  currentTime,
  onSeek,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const formatTimestamp = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Get unique speakers
  const speakers = ['All', ...Array.from(new Set(transcripts.map((t) => t.speaker_name)))];

  // Filter transcripts
  const filteredTranscripts = transcripts.filter((t) => {
    const matchesSpeaker = selectedSpeaker === 'All' || t.speaker_name === selectedSpeaker;
    const matchesSearch = !searchTerm || t.text.toLowerCase().includes(searchTerm.toLowerCase()) || t.speaker_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  // Highlight matches function
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-500/30 text-yellow-300 px-1 rounded border border-yellow-500/50">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl flex flex-col h-full overflow-hidden shadow-xl">
      {/* Transcript Header & Filters */}
      <div className="p-4 border-b border-[#212E4A] flex flex-wrap items-center justify-between gap-3 bg-[#0D1322]/50">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm text-white flex items-center gap-2">
            <span>Transcript</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
              {filteredTranscripts.length}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in transcript..."
              className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Speaker filter dropdown */}
        <select
          value={selectedSpeaker}
          onChange={(e) => setSelectedSpeaker(e.target.value)}
          className="bg-[#0D1322] border border-[#212E4A] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          {speakers.map((spk) => (
            <option key={spk} value={spk}>
              {spk}
            </option>
          ))}
        </select>
      </div>

      {/* Transcript Items Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTranscripts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No matching transcript segments found.
          </div>
        ) : (
          filteredTranscripts.map((item) => {
            const isActive = currentTime >= item.start_time && currentTime <= item.end_time;

            return (
              <div
                key={item.id}
                ref={(el) => { itemRefs.current[item.id] = el; }}
                onClick={() => onSeek(item.start_time)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
                  isActive
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-[#0D1322]/40 border-[#212E4A]/60 hover:bg-[#1B2640]/50 hover:border-slate-700'
                }`}
              >
                {/* Header: Avatar, Speaker Name, Timestamp */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-sm"
                      style={{ backgroundColor: item.speaker_avatar || '#6366F1' }}
                    >
                      {item.speaker_name.split(' ').map((n) => n[0]).join('')}
                    </div>

                    <span className="font-semibold text-xs text-white">
                      {renderHighlightedText(item.speaker_name, searchTerm)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeek(item.start_time);
                      }}
                      className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md hover:bg-indigo-500/20 transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{formatTimestamp(item.start_time)}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.id, item.text);
                      }}
                      className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Copy text"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Content text */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal pl-8">
                  {renderHighlightedText(item.text, searchTerm)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
