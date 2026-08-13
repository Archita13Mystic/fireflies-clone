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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900">Action Items & Tasks</h3>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
            {pendingCount} Pending
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-1 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-3 bg-slate-50 border border-purple-200 rounded-xl space-y-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Describe action item..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              placeholder="Assignee name"
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-center py-6 text-slate-500 text-xs">No action items recorded for this meeting.</p>
        ) : (
          items.map((item) => {
            const isDone = item.status === 'completed';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                  isDone
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(item)}
                    className="mt-0.5 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                    )}
                  </button>

                  <div>
                    <p className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                      {item.text}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
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
                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
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
