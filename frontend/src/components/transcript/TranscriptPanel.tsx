import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, FileCode, CheckCircle2 } from "lucide-react";
import { TranscriptLine as TranscriptLineType } from "../../lib/types";
import TranscriptSearch from "./TranscriptSearch";
import TranscriptLine from "./TranscriptLine";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

interface TranscriptPanelProps {
  meetingId: number;
  transcript: TranscriptLineType[];
  activeTime: number;
  onSeek: (time: number) => void;
  onRefresh: () => void;
}

export default function TranscriptPanel({
  meetingId,
  transcript,
  activeTime,
  onSeek,
  onRefresh,
}: TranscriptPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const activeLine = transcript.find(
    (line) => activeTime >= line.start_time && activeTime < line.end_time
  );

  useEffect(() => {
    if (activeLine && containerRef.current) {
      const activeEl = containerRef.current.querySelector(
        `[data-sequence="${activeLine.sequence}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeLine?.sequence]);

  useEffect(() => {
    if (!searchQuery) {
      setMatchCount(0);
      return;
    }
    const matches = transcript.filter((line) =>
      line.text.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
    setMatchCount(matches);
  }, [searchQuery, transcript]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadTranscript(meetingId, file);
      toast.success(`Transcript processed (${res.inserted} lines imported)!`);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || "Failed to upload transcript file.";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#16161e] border border-[#2a2a3a] rounded-lg overflow-hidden text-white">
      {/* Header section with search and upload */}
      <div className="p-4 border-b border-[#2a2a3a] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#1e1e2a]/30">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[#7c5cfc]" />
          <h3 className="font-bold text-sm">Transcript ({transcript.length} lines)</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48 md:w-64">
            <TranscriptSearch onSearch={setSearchQuery} matchCount={matchCount} />
          </div>

          <label
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7c5cfc]/15 text-xs font-semibold text-[#7c5cfc] hover:bg-[#7c5cfc]/25 transition-colors border border-[#7c5cfc]/30 cursor-pointer select-none"
            title="Upload .txt, .vtt, or .json transcript file"
          >
            <Upload size={14} />
            <span>{isUploading ? "Uploading..." : "Upload (.vtt/.txt/.json)"}</span>
            <input
              type="file"
              accept=".txt,.vtt,.json"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Transcript scroll area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth scrollbar-thin scrollbar-thumb-[#2a2a3a]"
      >
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#9090a0] space-y-3">
            <div className="p-3 rounded-full bg-[#1e1e2a] border border-[#2a2a3a]">
              <FileCode size={30} className="text-[#7c5cfc]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No transcript lines</p>
              <p className="text-xs text-[#9090a0] mt-1 max-w-xs mx-auto">
                Upload a <span className="text-[#7c5cfc] font-mono">.vtt</span>, <span className="text-[#7c5cfc] font-mono">.txt</span>, or <span className="text-[#7c5cfc] font-mono">.json</span> file to populate dialogues and sync media playback.
              </p>
            </div>
          </div>
        ) : (
          transcript.map((line) => (
            <TranscriptLine
              key={line.id}
              line={line}
              isActive={activeLine?.id === line.id}
              searchQuery={searchQuery}
              onTimestampClick={onSeek}
            />
          ))
        )}
      </div>
    </div>
  );
}
