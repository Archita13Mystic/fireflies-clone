'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../lib/api';

interface AskFredChatProps {
  meetingId: number;
  initialMessages: ChatMessage[];
}

export const AskFredChat: React.FC<AskFredChatProps> = ({ meetingId, initialMessages }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userTemp: ChatMessage = {
      id: Date.now(),
      meeting_id: meetingId,
      sender: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userTemp]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const fredResponse = await api.sendChatMessage(meetingId, textToSend);
      setMessages((prev) => [...prev, fredResponse]);
    } catch (err) {
      console.error('Failed getting Fred answer:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          meeting_id: meetingId,
          sender: 'fred',
          content: 'Sorry, I encountered an issue analyzing the transcript. Please try asking again!',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'What are the key action items?',
    'Summarize the main discussion points.',
    'Who participated in this meeting?'
  ];

  return (
    <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl flex flex-col h-[560px] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-[#212E4A] flex items-center justify-between bg-[#0D1322]/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
              <span>Ask Fred</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI Assistant
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Contextual QA over meeting transcript</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Bot className="w-10 h-10 text-purple-400 mx-auto animate-bounce" />
            <p className="text-xs text-slate-300 font-medium">Hi! I am Fred, your AI meeting assistant.</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Ask me anything about this meeting's decisions, action items, or timestamps!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isFred = msg.sender === 'fred';

            return (
              <div key={msg.id} className={`flex gap-3 ${isFred ? 'justify-start' : 'justify-end'}`}>
                {isFred && (
                  <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isFred
                      ? 'bg-[#0D1322] border border-[#212E4A] text-slate-200 rounded-tl-none'
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {msg.content}
                </div>

                {!isFred && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0 mt-0.5">
                    AS
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Fred is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-[#0D1322]/40 border-t border-[#212E4A]/60 flex items-center gap-2 overflow-x-auto">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-2.5 py-1 rounded-full bg-[#1B2640] border border-[#212E4A] text-[10px] text-indigo-300 hover:border-indigo-500/40 shrink-0 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#212E4A] bg-[#0D1322]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Fred a question..."
            className="flex-1 bg-[#131B2E] border border-[#212E4A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all shadow-md shadow-purple-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
