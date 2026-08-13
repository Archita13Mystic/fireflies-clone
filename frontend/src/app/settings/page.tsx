'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar';
import { 
  Settings, 
  User, 
  Bot, 
  Sparkles, 
  Key, 
  Save, 
  Check, 
  Copy, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Volume2,
  Sliders,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'bot' | 'ai' | 'api'>('profile');

  // Account State
  const [userName, setUserName] = useState('Archita Sharma');
  const [email, setEmail] = useState('archita@fireflies.ai');
  const [workspaceName, setWorkspaceName] = useState("Archita's Workspace");
  const [language, setLanguage] = useState('English (US)');

  // Bot State
  const [botName, setBotName] = useState('Fireflies Notetaker Bot');
  const [joinAllEvents, setJoinAllEvents] = useState(true);
  const [joinOwnedOnly, setJoinOwnedOnly] = useState(false);
  const [autoEmailRecap, setAutoEmailRecap] = useState(true);

  // AI & Fred State
  const [summaryFormat, setSummaryFormat] = useState('Executive Overview + Key Takeaways');
  const [actionSensitivity, setActionSensitivity] = useState('Medium');

  // API State
  const [apiKey, setApiKey] = useState('ff_live_sk_98f7a23b1c4e9081a2f6');
  const [copiedKey, setCopiedKey] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const savedName = localStorage.getItem('ff_userName');
    const savedWorkspace = localStorage.getItem('ff_workspaceName');
    const savedBotName = localStorage.getItem('ff_botName');
    const savedApiKey = localStorage.getItem('ff_apiKey');

    if (savedName) setUserName(savedName);
    if (savedWorkspace) setWorkspaceName(savedWorkspace);
    if (savedBotName) setBotName(savedBotName);
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ff_userName', userName);
    localStorage.setItem('ff_workspaceName', workspaceName);
    showToast('Profile & Workspace settings saved successfully!');
  };

  const handleSaveBot = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ff_botName', botName);
    showToast('Meeting Assistant Bot preferences updated!');
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Ask Fred & AI Summary settings updated!');
  };

  const handleGenerateApiKey = () => {
    const newKey = `ff_live_sk_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    setApiKey(newKey);
    localStorage.setItem('ff_apiKey', newKey);
    showToast('New API key generated!');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar searchQuery="" onSearchChange={() => {}} onOpenUploadModal={() => {}} />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6">
        {/* Settings Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span>App & Workspace Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your user profile, notetaker bot join rules, AI summary formats, and API credentials.
          </p>
        </div>

        {/* Settings Tabs Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-[#131B2E] border border-[#212E4A] rounded-2xl text-xs font-medium overflow-x-auto shadow-md">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('bot')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'bot'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Notetaker Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'ai'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Fred & AI Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'api'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API & Integrations</span>
          </button>
        </div>

        {/* TAB 1: Profile & Workspace */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#212E4A]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg">
                AS
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{userName}</h3>
                <p className="text-xs text-slate-400">Workspace Owner • {email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Transcription Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#212E4A] flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Notetaker Bot */}
        {activeTab === 'bot' && (
          <form onSubmit={handleSaveBot} className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bot Name Displayed in Meetings</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. Fireflies Notetaker Bot"
                className="w-full max-w-md bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-[#212E4A]">
              <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">Calendar Join Rules</h4>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0D1322] border border-[#212E4A]">
                <div>
                  <p className="font-semibold text-xs text-white">Join all calendar events with video link</p>
                  <p className="text-[11px] text-slate-400">Automatically send bot to Google Meet, Zoom, and Teams calls</p>
                </div>
                <input
                  type="checkbox"
                  checked={joinAllEvents}
                  onChange={(e) => setJoinAllEvents(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0D1322] border border-[#212E4A]">
                <div>
                  <p className="font-semibold text-xs text-white">Join only meetings I own / organize</p>
                  <p className="text-[11px] text-slate-400">Skip external meetings where you are an invited guest</p>
                </div>
                <input
                  type="checkbox"
                  checked={joinOwnedOnly}
                  onChange={(e) => setJoinOwnedOnly(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0D1322] border border-[#212E4A]">
                <div>
                  <p className="font-semibold text-xs text-white">Auto-send recap emails after meeting</p>
                  <p className="text-[11px] text-slate-400">Email summary and action items to all meeting participants</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoEmailRecap}
                  onChange={(e) => setAutoEmailRecap(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#212E4A] flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Bot Preferences</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Ask Fred & AI Customization */}
        {activeTab === 'ai' && (
          <form onSubmit={handleSaveAI} className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">AI Summary Output Format</label>
                <select
                  value={summaryFormat}
                  onChange={(e) => setSummaryFormat(e.target.value)}
                  className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                >
                  <option value="Executive Overview + Key Takeaways">Executive Overview + Key Takeaways</option>
                  <option value="Detailed Paragraphs by Speaker">Detailed Paragraphs by Speaker</option>
                  <option value="Bullet Points Only">Bullet Points Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Action Item Extraction Sensitivity</label>
                <select
                  value={actionSensitivity}
                  onChange={(e) => setActionSensitivity(e.target.value)}
                  className="w-full bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                >
                  <option value="High (All tasks & commitments)">High (All tasks & commitments)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="Low (Explicit assignees only)">Low (Explicit assignees only)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 space-y-1">
              <p className="font-semibold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Ask Fred AI Engine Status</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Ask Fred is active and powered by transcript RAG context matching across your workspace.
              </p>
            </div>

            <div className="pt-4 border-t border-[#212E4A] flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-purple-600/30 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save AI Preferences</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: API & Credentials */}
        {activeTab === 'api' && (
          <div className="bg-[#131B2E] border border-[#212E4A] rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-bold text-sm text-white mb-1">Personal API Secret Key</h3>
              <p className="text-xs text-slate-400 mb-3">Use this key to authenticate REST API requests to your Fireflies clone backend.</p>

              <div className="flex items-center gap-2 max-w-lg">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 bg-[#0D1322] border border-[#212E4A] rounded-xl px-3.5 py-2 text-xs font-mono text-indigo-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3.5 py-2 rounded-xl bg-[#1B2640] border border-[#212E4A] hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGenerateApiKey}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-[#212E4A]"
                >
                  Generate New API Key
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
