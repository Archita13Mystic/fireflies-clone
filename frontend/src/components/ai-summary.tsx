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
      <div className="p-6 text-center text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl">
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
    <div className="space-y-4">
      {/* Executive Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900">Executive Overview</h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          {summary.overview}
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900">Key Takeaways & Highlights</h3>
        </div>
        <ul className="space-y-2">
          {summary.key_takeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chapters Outline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900">Meeting Chapters</h3>
        </div>

        <div className="space-y-2">
          {summary.chapters.map((ch, idx) => (
            <div
              key={idx}
              onClick={() => onSeek(ch.start_time)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
                  {ch.title}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  {formatTimestamp(ch.start_time)}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {ch.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
