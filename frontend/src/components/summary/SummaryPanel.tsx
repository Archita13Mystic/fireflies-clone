import React, { useState } from "react";
import { Sparkles, CheckSquare, List, HelpCircle, RefreshCw, Loader2 } from "lucide-react";
import { Summary, ActionItem } from "../../lib/types";
import TopicsChips from "./TopicsChips";
import ActionItemsList from "./ActionItemsList";
import OutlineList from "./OutlineList";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

interface SummaryPanelProps {
  meetingId: number;
  summary: Summary | null;
  actionItems: ActionItem[];
  onSeek: (time: number) => void;
  onRefresh: () => void;
}

type TabType = "summary" | "actions" | "outline";

export default function SummaryPanel({
  meetingId,
  summary,
  actionItems,
  onSeek,
  onRefresh,
}: SummaryPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { id: "summary" as TabType, label: "Summary" },
    { id: "actions" as TabType, label: "Action Items" },
    { id: "outline" as TabType, label: "Outline" },
  ];

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      await api.generateSummary(meetingId);
      toast.success("AI Summary & Action items generated successfully!");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || "Failed to generate AI summary.";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#16161e] border border-[#2a2a3a] rounded-lg overflow-hidden text-white">
      {/* Tab bar header */}
      <div className="flex items-center justify-between border-b border-[#2a2a3a] bg-[#1e1e2a]/30 pr-3">
        <div className="flex flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all focus:outline-none select-none ${
                activeTab === tab.id
                  ? "border-[#7c5cfc] text-white bg-[#1e1e2a]/20"
                  : "border-transparent text-[#9090a0] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Action button */}
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          title="Generate / Refresh AI Summary with LLM engine"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#7c5cfc]/15 text-[#7c5cfc] hover:bg-[#7c5cfc]/25 border border-[#7c5cfc]/30 text-xs font-semibold transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Sparkles size={13} />
          )}
          <span>{summary ? "Regenerate" : "AI Summarize"}</span>
        </button>
      </div>

      {/* Tab contents */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#2a2a3a]">
        {!summary ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#9090a0] space-y-3">
            <div className="p-3 rounded-full bg-[#1e1e2a] border border-[#2a2a3a]">
              <Sparkles size={28} className="text-[#7c5cfc]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No summary generated yet</p>
              <p className="text-xs text-[#9090a0] mt-1 max-w-xs mx-auto">
                Generate an AI summary, outline chapters, and extracted action items directly from the meeting transcript.
              </p>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c5cfc] hover:bg-[#6b47e5] text-white text-xs font-bold transition-all shadow-md shadow-[#7c5cfc]/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing Transcripts...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate AI Summary
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* SUMMARY TAB */}
            {activeTab === "summary" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#7c5cfc] font-bold text-sm">
                    <Sparkles size={16} />
                    <span>AI Overview Summary</span>
                  </div>
                  <p className="text-sm text-[#d1d1e0] leading-relaxed break-words bg-[#13131b]/60 p-3.5 rounded-lg border border-[#2a2a3a]/40">
                    {summary.overview}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#2a2a3a]/40">
                  <h4 className="text-sm font-bold text-white">Key Topics</h4>
                  <TopicsChips topics={summary.key_topics} />
                </div>
              </div>
            )}

            {/* ACTION ITEMS TAB */}
            {activeTab === "actions" && (
              <div className="animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[#7c5cfc] font-bold text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} />
                    <span>Action Items ({actionItems.length})</span>
                  </div>
                </div>
                <ActionItemsList
                  meetingId={meetingId}
                  actionItems={actionItems}
                  onRefresh={onRefresh}
                />
              </div>
            )}

            {/* OUTLINE TAB */}
            {activeTab === "outline" && (
              <div className="animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-[#7c5cfc] font-bold text-sm mb-4">
                  <List size={16} />
                  <span>Meeting Outline</span>
                </div>
                <OutlineList outline={summary.outline} onSeek={onSeek} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
