import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { api } from "../../lib/api";
import { Meeting } from "../../lib/types";
import toast from "react-hot-toast";

interface EditMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onSuccess: () => void;
}

export default function EditMeetingModal({ isOpen, onClose, meeting, onSuccess }: EditMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(30);
  const [participantsText, setParticipantsText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && meeting) {
      setTitle(meeting.title);
      
      // Parse UTC string to local datetime-local format
      const d = new Date(meeting.date);
      const offset = d.getTimezoneOffset() * 60000;
      const localISODate = new Date(d.getTime() - offset).toISOString().substring(0, 16);
      setDate(localISODate);
      
      setDuration(Math.round(meeting.duration / 60));
      setParticipantsText(meeting.participants.join(", "));
    }
  }, [isOpen, meeting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meeting) return;
    if (!title.trim() || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const participants = participantsText
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      await api.updateMeeting(meeting.id, {
        title: title.trim(),
        date: new Date(date).toISOString(),
        duration: duration * 60,
        participants: participants.length > 0 ? participants : ["John Doe"],
      });

      toast.success("Meeting updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update meeting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Meeting">
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <Input
          label="Meeting Title *"
          placeholder="e.g. Q3 Roadmap Sync"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date & Time *"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Duration (minutes) *"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            required
          />
        </div>

        <Input
          label="Participants (comma-separated)"
          placeholder="e.g. Sarah Chen, Marcus Webb, Tom Okoro"
          value={participantsText}
          onChange={(e) => setParticipantsText(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a3a]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
