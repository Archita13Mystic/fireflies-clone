'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, Users, CheckCircle2, MessageSquare, Play, Trash2 } from 'lucide-react';
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
    Product: 'bg-purple-50 text-purple-700 border-purple-200',
    Engineering: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Customer: 'bg-blue-50 text-blue-700 border-blue-200',
    Executive: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Design: 'bg-pink-50 text-pink-700 border-pink-200',
    General: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const badgeColor = categoryColors[meeting.category] || categoryColors.General;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between group relative card-shadow hover:card-shadow-hover">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
            {meeting.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
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
                className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Meeting"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <Link href={`/meetings/${meeting.id}`} className="block group-hover:text-purple-700 transition-colors">
          <h3 className="font-semibold text-base text-slate-900 line-clamp-1 mb-2">
            {meeting.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
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

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {meeting.participants.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white shadow-sm"
                title={p}
              >
                {p.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center font-semibold text-[10px] text-slate-600">
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1" title="Action Items">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{meeting.action_items_count}</span>
            </div>
            <div className="flex items-center gap-1" title="Transcript Segments">
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              <span>{meeting.transcript_count}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3">
        <Link
          href={`/meetings/${meeting.id}`}
          className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all border border-purple-200 hover:border-purple-600"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>View Transcript & AI Notes</span>
        </Link>
      </div>
    </div>
  );
};
