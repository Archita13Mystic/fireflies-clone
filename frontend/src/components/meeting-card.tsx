'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, Users, CheckCircle2, MessageSquare, Play, Trash2, Tag } from 'lucide-react';
import { MeetingListItem } from '../types';

interface MeetingCardProps {
  meeting: MeetingListItem;
  onDelete?: (id: number) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onDelete }) => {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const minutes = Math.floor(meeting.duration_seconds / 60);

  const categoryColors: Record<string, string> = {
    Product: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Engineering: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Customer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Executive: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Design: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    General: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const badgeColor = categoryColors[meeting.category] || categoryColors.General;

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#212E4A] hover:border-indigo-500/40 transition-all flex flex-col justify-between group relative">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
            {meeting.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {minutes} mins
            </span>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(meeting.id);
                }}
                className="text-slate-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Meeting"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Meeting Title */}
        <Link href={`/meetings/${meeting.id}`} className="block group-hover:text-indigo-400 transition-colors">
          <h3 className="font-semibold text-base text-white line-clamp-1 mb-2">
            {meeting.title}
          </h3>
        </Link>

        {/* Meeting Info */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 truncate">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{meeting.organizer}</span>
          </div>
        </div>

        {/* Participants Avatars */}
        <div className="flex items-center justify-between pt-3 border-t border-[#212E4A]/60">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {meeting.participants.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-[#131B2E] flex items-center justify-center font-bold text-[10px] text-white shadow"
                title={p}
              >
                {p.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#131B2E] flex items-center justify-center font-semibold text-[10px] text-slate-300">
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1" title="Action Items">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{meeting.action_items_count}</span>
            </div>
            <div className="flex items-center gap-1" title="Transcript Segments">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>{meeting.transcript_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="mt-4 pt-3">
        <Link
          href={`/meetings/${meeting.id}`}
          className="w-full py-2 px-3 rounded-xl bg-[#1B2640] hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all group-hover:bg-indigo-600 group-hover:text-white"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>View Transcript & AI Notes</span>
        </Link>
      </div>
    </div>
  );
};
