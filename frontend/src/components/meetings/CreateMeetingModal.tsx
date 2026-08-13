import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMeetingModal({ isOpen, onClose, onSuccess }: CreateMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(30);
  const [participantsText, setParticipantsText] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set default datetime to local "now" when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000; // local offset in ms
      const localISODate = new Date(now.getTime() - offset).toISOString().substring(0, 16);
      setDate(localISODate);
      // Reset other states
      setTitle("");
      setDuration(30);
      setParticipantsText("");
      setTranscriptText("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Split participants by comma and clean whitespace
      const participants = participantsText
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      await api.createMeeting({
        title: title.trim(),
        date: new Date(date).toISOString(),
        duration,
        participants: participants.length > 0 ? participants : ["John Doe"],
        transcript_text: transcriptText.trim() || undefined,
      });

      toast.success("Meeting created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create meeting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Meeting">
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

        <Input
          label="Paste Transcript (optional)"
          placeholder="Format: Speaker Name (MM:SS): text OR Speaker Name: text"
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          isMultiline
          rows={6}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a3a]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Meeting
          </Button>
        </div>
      </form>
    </Modal>
  );
}
