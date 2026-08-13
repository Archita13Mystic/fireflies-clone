import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { api } from "../../lib/api";
import { Meeting } from "../../lib/types";
import toast from "react-hot-toast";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  meeting,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!meeting) return;
    setIsLoading(true);
    try {
      await api.deleteMeeting(meeting.id);
      toast.success("Meeting deleted successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete meeting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Meeting">
      <div className="space-y-4 text-white">
        <p className="text-sm text-[#9090a0]">
          Are you sure you want to delete &quot;<span className="text-white font-bold">{meeting?.title}</span>&quot;?
          This action is permanent and cannot be undone. All transcripts, summaries, and action items will be deleted.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a3a]">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
