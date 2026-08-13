import React, { useState } from "react";
import { Plus, X, User, Calendar, CheckSquare, Edit2 } from "lucide-react";
import { ActionItem } from "../../lib/types";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/utils";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

interface ActionItemsListProps {
  meetingId: number;
  actionItems: ActionItem[];
  onRefresh: () => void;
}

export default function ActionItemsList({ meetingId, actionItems, onRefresh }: ActionItemsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit action item states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleStartEdit = (item: ActionItem) => {
    setEditingId(item.id);
    setEditText(item.text);
    setEditAssignee(item.assignee || "");
    setEditDueDate(item.due_date || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditAssignee("");
    setEditDueDate("");
  };

  const handleSaveEdit = async (itemId: number) => {
    if (!editText.trim()) {
      toast.error("Action item text cannot be empty.");
      return;
    }
    setIsSavingEdit(true);
    try {
      await api.updateActionItem(itemId, {
        text: editText.trim(),
        assignee: editAssignee.trim() || undefined,
        due_date: editDueDate || undefined,
      });
      toast.success("Action item updated!");
      setEditingId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update action item.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleToggleComplete = async (item: ActionItem) => {
    try {
      await api.updateActionItem(item.id, { completed: !item.completed });
      toast.success(item.completed ? "Action item marked as open" : "Action item completed!");
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update action item status.");
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      await api.deleteActionItem(itemId);
      toast.success("Action item deleted");
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete action item.");
    }
  };

  const handleAddActionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please fill in action item text.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createActionItem(meetingId, {
        text: text.trim(),
        assignee: assignee.trim() || undefined,
        due_date: dueDate || undefined,
      });

      toast.success("Action item added!");
      setText("");
      setAssignee("");
      setDueDate("");
      setShowForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add action item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `Due ${months[d.getMonth()]} ${d.getDate()}`;
  };

  return (
    <div className="space-y-4">
      {actionItems.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#9090a0]">
          No action items yet.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {actionItems.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <li
                key={item.id}
                className="group flex flex-col gap-3 p-3 rounded-md bg-[#1e1e2a]/40 border border-[#2a2a3a]/30 hover:border-[#2a2a3a] transition-all"
              >
                {isEditing ? (
                  <div className="space-y-3 w-full">
                    <Input
                      placeholder="What needs to be done? *"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      required
                      autoFocus
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Assign to…"
                        value={editAssignee}
                        onChange={(e) => setEditAssignee(e.target.value)}
                      />
                      <Input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#2a2a3a]/40">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={isSavingEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleSaveEdit(item.id)}
                        isLoading={isSavingEdit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleComplete(item)}
                        className="mt-1 h-4.5 w-4.5 shrink-0 rounded border-[#2a2a3a] bg-[#16161e] text-[#7c5cfc] focus:ring-[#7c5cfc]/50 accent-[#7c5cfc] cursor-pointer"
                      />

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm break-words leading-relaxed ${
                            item.completed ? "line-through text-[#9090a0]" : "text-white"
                          }`}
                        >
                          {item.text}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {item.assignee && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-white bg-[#2a2a3a] px-2 py-0.5 rounded font-medium">
                              <User size={10} className="text-[#9090a0]" />
                              {item.assignee}
                            </span>
                          )}

                          {item.due_date && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#9090a0] font-medium">
                              <Calendar size={10} />
                              {formatDateDisplay(item.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 shrink-0">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1 rounded hover:bg-[#2a2a3a] text-[#9090a0] hover:text-white"
                        title="Edit action item"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded hover:bg-[#2a2a3a] text-[#9090a0] hover:text-red-400"
                        title="Delete action item"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Toggle inline Form button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#7c5cfc] hover:text-[#6c4cf2] transition-colors py-1.5 focus:outline-none select-none"
        >
          <Plus size={16} />
          Add Action Item
        </button>
      )}

      {/* Inline Add Action Item Form */}
      {showForm && (
        <form
          onSubmit={handleAddActionItem}
          className="p-4 rounded-md border border-[#2a2a3a] bg-[#1e1e2a]/40 space-y-3 animate-in fade-in duration-200"
        >
          <Input
            placeholder="What needs to be done? *"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Assign to…"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-[#2a2a3a]/40">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Add
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
