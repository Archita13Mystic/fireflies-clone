import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Meeting } from "../../lib/types";
import { formatDate, formatDuration, getAvatarColor, getInitials } from "../../lib/utils";
import Badge from "../ui/Badge";

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
}

export default function MeetingCard({ meeting, onEdit, onDelete }: MeetingCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const handleCardClick = () => {
    router.push(`/meetings/${meeting.id}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(meeting);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(meeting);
  };

  const maxAvatars = 3;
  const displayParticipants = meeting.participants.slice(0, maxAvatars);
  const extraCount = meeting.participants.length - maxAvatars;

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-lg border border-[#2a2a3a] bg-[#1e1e2a] p-5 hover:bg-[#252535] hover:border-[#3a3a50] transition-all cursor-pointer shadow-md select-none"
    >
      {/* Title + Action Menu */}
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-base font-bold text-white line-clamp-1 pr-6 group-hover:text-[#7c5cfc] transition-colors">
          {meeting.title}
        </h4>

        {/* Three dot actions dropdown */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            className="p-1 rounded text-[#9090a0] hover:text-white hover:bg-[#2a2a3a] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-32 rounded-md border border-[#2a2a3a] bg-[#16161e] py-1 shadow-lg z-10 animate-in fade-in slide-in-from-top-2 duration-100">
              <button
                onClick={handleEditClick}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#9090a0] hover:bg-[#1e1e2a] hover:text-white transition-colors"
              >
                <Edit2 size={12} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date & Duration Info */}
      <div className="mt-1 flex items-center gap-2 text-xs text-[#9090a0]">
        <span>{formatDate(meeting.date)}</span>
        <span>•</span>
        <span>{formatDuration(meeting.duration)}</span>
      </div>

      {/* Overlapping Participant Avatars */}
      <div className="mt-4 flex -space-x-1.5 overflow-hidden">
        {displayParticipants.map((name, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: getAvatarColor(name) }}
            title={name}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1e1e2a] group-hover:border-[#252535] text-[10px] font-bold text-white transition-colors uppercase"
          >
            {getInitials(name)}
          </div>
        ))}
        {extraCount > 0 && (
          <div
            title={`${extraCount} more`}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1e1e2a] group-hover:border-[#252535] bg-[#2a2a3a] text-[10px] font-bold text-[#9090a0] transition-colors"
          >
            +{extraCount}
          </div>
        )}
      </div>

      {/* Footer info: transcript counts and summary badges */}
      <div className="mt-5 pt-3 border-t border-[#2a2a3a]/40 flex items-center justify-between">
        <span className="text-xs text-[#9090a0] font-medium">
          {meeting.transcript_count} {meeting.transcript_count === 1 ? "line" : "lines"}
        </span>

        {meeting.has_summary && (
          <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider py-0.5 px-2">
            Summary
          </Badge>
        )}
      </div>
    </div>
  );
}
