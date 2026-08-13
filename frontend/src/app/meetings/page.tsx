"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Inbox, Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import SkeletonCard from "../../components/ui/SkeletonCard";
import MeetingCard from "../../components/meetings/MeetingCard";
import MeetingFilters from "../../components/meetings/MeetingFilters";
import CreateMeetingModal from "../../components/meetings/CreateMeetingModal";
import EditMeetingModal from "../../components/meetings/EditMeetingModal";
import DeleteConfirmModal from "../../components/meetings/DeleteConfirmModal";
import { api } from "../../lib/api";
import { Meeting } from "../../lib/types";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [participantFilter, setParticipantFilter] = useState("");

  // Modals State
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getMeetings(searchQuery, sortOrder, participantFilter);
      setMeetings(data);
    } catch (err) {
      console.error("Failed fetching meetings list:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortOrder, participantFilter]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleEditClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setEditOpen(true);
  };

  const handleDeleteClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setDeleteOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Meetings</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          variant="primary"
          className="flex items-center gap-1.5 font-semibold"
        >
          <Plus size={16} />
          New Meeting
        </Button>
      </div>

      {/* Filter and Search controls */}
      <MeetingFilters
        onSearchChange={setSearchQuery}
        onSortChange={setSortOrder}
        onParticipantChange={setParticipantFilter}
      />

      {/* Main Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#1e1e2a]/20 border border-[#2a2a3a]/40 rounded-xl p-8 max-w-md mx-auto">
          <Inbox size={48} className="text-[#2a2a3a] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1.5">No meetings found</h3>
          <p className="text-sm text-[#9090a0] mb-6">
            Create your first meeting or adjust your search filters
          </p>
          <Button
            onClick={() => setCreateOpen(true)}
            variant="primary"
            className="flex items-center gap-1.5 font-semibold"
          >
            <Plus size={16} />
            New Meeting
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchMeetings}
      />

      {/* Edit Meeting Modal */}
      <EditMeetingModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        meeting={selectedMeeting}
        onSuccess={fetchMeetings}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        meeting={selectedMeeting}
        onSuccess={fetchMeetings}
      />
    </div>
  );
}
