'use client';

import React from 'react';
import { X, Download, FileText, Code, FileCode } from 'lucide-react';
import { api } from '../lib/api';

interface ExportModalProps {
  isOpen: boolean;
  meetingId: number;
  title: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, meetingId, title, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = (format: 'md' | 'txt' | 'json') => {
    const url = api.getExportUrl(meetingId, format);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131B2E] border border-[#212E4A] w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Export Meeting Notes</h2>
            <p className="text-xs text-slate-400 truncate max-w-[200px]">{title}</p>
          </div>
        </div>

        <div className="space-y-2.5 my-4">
          <button
            onClick={() => handleDownload('md')}
            className="w-full p-3 rounded-xl bg-[#0D1322] border border-[#212E4A] hover:border-indigo-500/50 flex items-center justify-between text-xs text-slate-200 hover:bg-[#1B2640] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <p className="font-semibold text-white group-hover:text-indigo-400">Markdown (.md)</p>
                <p className="text-[10px] text-slate-400">Includes formatted summary, action items & transcript</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </button>

          <button
            onClick={() => handleDownload('txt')}
            className="w-full p-3 rounded-xl bg-[#0D1322] border border-[#212E4A] hover:border-indigo-500/50 flex items-center justify-between text-xs text-slate-200 hover:bg-[#1B2640] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <p className="font-semibold text-white group-hover:text-emerald-400">Plain Text (.txt)</p>
                <p className="text-[10px] text-slate-400">Clean unformatted text log</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => handleDownload('json')}
            className="w-full p-3 rounded-xl bg-[#0D1322] border border-[#212E4A] hover:border-indigo-500/50 flex items-center justify-between text-xs text-slate-200 hover:bg-[#1B2640] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Code className="w-4 h-4 text-purple-400" />
              <div className="text-left">
                <p className="font-semibold text-white group-hover:text-purple-400">Raw JSON (.json)</p>
                <p className="text-[10px] text-slate-400">Structured data with timestamps & metadata</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
