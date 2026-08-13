"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MeetingDetail, Meeting } from "../../../lib/types";
import { api } from "../../../lib/api";
import { formatDate, formatDuration, getAvatarColor } from "../../../lib/utils";
import TranscriptPanel from "../../../components/transcript/TranscriptPanel";
import SummaryPanel from "../../../components/summary/SummaryPanel";
import AudioPlayer from "../../../components/player/AudioPlayer";
import EditMeetingModal from "../../../components/meetings/EditMeetingModal";
import DeleteConfirmModal from "../../../components/meetings/DeleteConfirmModal";
import Spinner from "../../../components/ui/Spinner";
import toast from "react-hot-toast";

interface PageProps {
  params: {
    id: string;
  };
}

export default function MeetingDetailPage({ params }: PageProps) {
  const router = useRouter();
  const meetingId = parseInt(params.id) || 0;

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Audio Playback states
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Edit / Delete Modals
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Inline Title Editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleVal, setEditTitleVal] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const fetchMeetingDetail = useCallback(async () => {
    try {
      const data = await api.getMeetingDetail(meetingId);
      setMeeting(data);
      setEditTitleVal(data.title);
      setDuration(data.duration);
    } catch (err) {
      console.error("Failed fetching meeting details:", err);
      toast.error("Failed loading meeting details");
    } finally {
      setIsLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    if (meetingId) {
      fetchMeetingDetail();
    }
  }, [meetingId, fetchMeetingDetail]);

  // Focus title input on edit mode trigger
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleInlineTitleSave = async () => {
    if (!editTitleVal.trim()) {
      setEditTitleVal(meeting?.title || "");
      setIsEditingTitle(false);
      return;
    }
    if (editTitleVal === meeting?.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await api.updateMeeting(meetingId, { title: editTitleVal.trim() });
      toast.success("Meeting title updated");
      if (meeting) {
        setMeeting({ ...meeting, title: editTitleVal.trim() });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update title");
      setEditTitleVal(meeting?.title || "");
    } finally {
      setIsEditingTitle(false);
    }
  };

  const handleDeleteSuccess = () => {
    router.replace("/meetings");
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#0f0f13]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center bg-[#0f0f13] text-center p-6">
        <h2 className="text-xl font-bold text-white mb-2">Meeting not found</h2>
        <Link href="/meetings" className="text-sm text-[#7c5cfc] hover:underline flex items-center gap-1">
          <ArrowLeft size={16} />
          Go back to Meetings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-[#0f0f13] overflow-hidden">
      {/* LEFT PANEL - 60% Width */}
      <div className="w-full lg:w-3/5 flex flex-col h-full border-r border-[#2a2a3a]">
        {/* Header row */}
        <div className="p-6 border-b border-[#2a2a3a] space-y-4 shrink-0 bg-[#16161e]/40">
          <div className="flex items-start justify-between gap-4">
            {/* Inline Title Editor */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editTitleVal}
                  onChange={(e) => setEditTitleVal(e.target.value)}
                  onBlur={handleInlineTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInlineTitleSave();
                    if (e.key === "Escape") {
                      setEditTitleVal(meeting.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-full bg-[#16161e] text-xl font-bold text-white border border-[#7c5cfc] rounded px-2.5 py-1 focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-2 group max-w-full">
                  <h2 className="text-xl font-bold text-white truncate">{meeting.title}</h2>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 rounded text-[#9090a0] hover:text-white hover:bg-[#2a2a3a] transition-all opacity-0 group-hover:opacity-100"
                    title="Edit title inline"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Edit / Delete Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#2a2a3a] hover:bg-[#35354a] text-xs font-semibold text-white transition-colors border border-[#2a2a3a]"
              >
                <Edit2 size={12} />
                Edit
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#ef4444]/10 hover:bg-[#ef4444]/25 text-xs font-semibold text-red-400 transition-colors border border-red-500/20"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>

          {/* Participant chips */}
          <div className="flex flex-wrap items-center gap-2">
            {meeting.participants.map((name, idx) => (
              <span
                key={idx}
                style={{ backgroundColor: `${getAvatarColor(name)}22`, borderColor: `${getAvatarColor(name)}44` }}
                className="px-2.5 py-0.5 rounded border text-xs text-white font-medium"
              >
                {name}
              </span>
            ))}
          </div>

          {/* Meta row info */}
          <div className="flex items-center gap-4 text-xs text-[#9090a0]">
            <span>{formatDate(meeting.date)}</span>
            <span>•</span>
            <span>{formatDuration(meeting.duration)}</span>
          </div>
        </div>

        {/* Scrollable Transcript Panel */}
        <div className="flex-1 overflow-hidden p-6 min-h-0 bg-[#0f0f13]">
          <TranscriptPanel
            meetingId={meeting.id}
            transcript={meeting.transcript}
            activeTime={currentTime}
            onSeek={handleSeek}
            onRefresh={fetchMeetingDetail}
          />
        </div>

        {/* Audio Player Sticky Bar */}
        <div className="shrink-0">
          <AudioPlayer
            currentTime={currentTime}
            duration={duration}
            onTimeUpdate={setCurrentTime}
          />
        </div>
      </div>

      {/* RIGHT PANEL - 40% Width */}
      <div className="w-full lg:w-2/5 flex flex-col h-full bg-[#0f0f13] p-6 lg:p-6 overflow-hidden">
        <SummaryPanel
          meetingId={meeting.id}
          summary={meeting.summary}
          actionItems={meeting.action_items}
          onSeek={handleSeek}
          onRefresh={fetchMeetingDetail}
        />
      </div>

      {/* Shared modals */}
      <EditMeetingModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        meeting={meeting as Meeting}
        onSuccess={fetchMeetingDetail}
      />

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        meeting={meeting as Meeting}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
