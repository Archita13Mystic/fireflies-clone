'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, Plus, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMeetingId: number) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product');
  const [rawText, setRawText] = useState('');
  const [participantsText, setParticipantsText] = useState('Archita Sharma, Alex Rivera, Devin Chen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a meeting title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (activeTab === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title.trim());
        formData.append('category', category);

        const res = await api.uploadTranscriptFile(formData);
        onSuccess(res.meeting_id);
        onClose();
      } else {
        const participants = participantsText.split(',').map((p) => p.trim()).filter(Boolean);
        const newMeeting = await api.createMeeting({
          title: title.trim(),
          category,
          raw_transcript: rawText,
          participants,
        });

        onSuccess(newMeeting.id);
        onClose();
      }
    } catch (err) {
      console.error('Failed creating meeting:', err);
      setError('Error parsing or saving transcript. Please check format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131B2E] border border-[#212E4A] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1B2640]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Create / Upload Meeting</h2>
            <p className="text-xs text-slate-400">Add a meeting transcript and auto-generate AI summaries</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#0D1322] border border-[#212E4A] rounded-xl mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'paste' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Transcript Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'file' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File (.txt, .vtt, .json)
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Sprint Planning Sync"
              className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="Customer">Customer</option>
                <option value="Executive">Executive</option>
                <option value="Design">Design</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Participants (comma separated)</label>
              <input
                type="text"
                value={participantsText}
                onChange={(e) => setParticipantsText(e.target.value)}
                placeholder="Archita, Alex, Devin"
                className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {activeTab === 'paste' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transcript Content</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste transcript here... e.g.
Archita Sharma: Welcome to the meeting!
Alex Rivera: Let's discuss our upcoming release timeline."
                className="w-full h-32 bg-[#0D1322] border border-[#212E4A] rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Transcript File</label>
              <div className="border-2 border-dashed border-[#212E4A] hover:border-indigo-500/50 rounded-xl p-6 text-center bg-[#0D1322]/50 cursor-pointer relative">
                <input
                  type="file"
                  accept=".txt,.vtt,.json"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click or drop transcript file here'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Supports VTT, JSON array, or plain text</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Processing...' : 'Process & Save Meeting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
