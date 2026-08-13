'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Play, Layers } from 'lucide-react';
import { Summary } from '../types';

interface AISummaryProps {
  summary?: Summary;
  onSeek: (time: number) => void;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary, onSeek }) => {
  if (!summary) {
    return (
      <div className="p-6 text-center text-slate-400 text-xs bg-[#131B2E] border border-[#212E4A] rounded-2xl">
        AI Summary generating or unavailable.
      </div>
    );
  }

  const formatTimestamp = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Executive Overview */}
      <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">Executive Overview</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-[#0D1322]/40 border border-[#212E4A]/50 p-4 rounded-xl">
          {summary.overview}
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">Key Takeaways & Highlights</h3>
        </div>
        <ul className="space-y-2.5">
          {summary.key_takeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-[#0D1322]/40 border border-[#212E4A]/50 p-3 rounded-xl text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chapters Outline Timeline */}
      <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">Meeting Chapters & Outline</h3>
        </div>

        <div className="space-y-3">
          {summary.chapters.map((ch, idx) => (
            <div
              key={idx}
              onClick={() => onSeek(ch.start_time)}
              className="p-3.5 rounded-xl bg-[#0D1322]/50 border border-[#212E4A] hover:border-indigo-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-white group-hover:text-indigo-400 transition-colors">
                  {ch.title}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  {formatTimestamp(ch.start_time)}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {ch.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
