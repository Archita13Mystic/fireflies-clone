'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, User, Calendar, CheckCircle2 } from 'lucide-react';
import { ActionItem } from '../types';
import { api } from '../lib/api';

interface ActionItemsProps {
  meetingId: number;
  initialItems: ActionItem[];
  onItemsChange: (items: ActionItem[]) => void;
}

export const ActionItemsList: React.FC<ActionItemsProps> = ({
  meetingId,
  initialItems,
  onItemsChange,
}) => {
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  const [newText, setNewText] = useState('');
  const [newAssignee, setNewAssignee] = useState('Archita Sharma');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = async (item: ActionItem) => {
    const newStatus = item.status === 'completed' ? 'pending' : 'completed';
    const updatedLocal = items.map((i) => (i.id === item.id ? { ...i, status: newStatus as 'completed' | 'pending' } : i));
    setItems(updatedLocal);
    onItemsChange(updatedLocal);

    try {
      await api.updateActionItem(meetingId, item.id, { status: newStatus });
    } catch (err) {
      console.error('Failed toggling action item:', err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      const created = await api.createActionItem(meetingId, {
        text: newText.trim(),
        assignee: newAssignee,
        due_date: 'Next Sprint',
      });

      const updated = [...items, created];
      setItems(updated);
      onItemsChange(updated);
      setNewText('');
      setIsAdding(false);
    } catch (err) {
      console.error('Failed adding action item:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    onItemsChange(updated);

    try {
      await api.deleteActionItem(meetingId, id);
    } catch (err) {
      console.error('Failed deleting action item:', err);
    }
  };

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const completedCount = items.filter((i) => i.status === 'completed').length;

  return (
    <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">Action Items & Tasks</h3>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            {pendingCount} Pending
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-1 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-[#0D1322] border border-indigo-500/30 rounded-xl space-y-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Describe action item..."
            className="w-full bg-[#131B2E] border border-[#212E4A] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              placeholder="Assignee name"
              className="bg-[#131B2E] border border-[#212E4A] rounded-lg px-2.5 py-1 text-xs text-slate-300 placeholder-slate-400"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg"
              >
                Save Item
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <p className="text-center py-6 text-slate-400 text-xs">No action items recorded for this meeting.</p>
        ) : (
          items.map((item) => {
            const isDone = item.status === 'completed';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                  isDone
                    ? 'bg-[#0D1322]/30 border-[#212E4A]/40 opacity-70'
                    : 'bg-[#0D1322]/60 border-[#212E4A] hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(item)}
                    className="mt-0.5 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
                    )}
                  </button>

                  <div>
                    <p className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}`}>
                      {item.text}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        <User className="w-3 h-3" />
                        {item.assignee}
                      </span>
                      {item.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
