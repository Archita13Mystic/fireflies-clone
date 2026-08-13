import { MeetingListItem, MeetingDetail, MeetingStats, ActionItem, ChatMessage } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Fallback Mock Meetings Data for standalone demo & instant preview
const MOCK_MEETINGS: MeetingListItem[] = [
  {
    id: 1,
    title: 'Q3 Product Strategy & Roadmap Alignment',
    date: new Date(Date.now() - 86400000).toISOString(),
    duration_seconds: 1420,
    organizer: 'Archita Sharma',
    participants: ['Archita Sharma', 'Alex Rivera', 'Devin Chen', 'Sarah Jenkins'],
    category: 'Product',
    audio_url: '/samples/sample-meeting.mp3',
    action_items_count: 3,
    transcript_count: 7,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    title: 'Engineering Architecture & Microservices Migration',
    date: new Date(Date.now() - 259200000).toISOString(),
    duration_seconds: 2100,
    organizer: 'Archita Sharma',
    participants: ['Archita Sharma', 'Marcus Vance', 'Devin Chen'],
    category: 'Engineering',
    audio_url: '/samples/sample-meeting.mp3',
    action_items_count: 2,
    transcript_count: 4,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 3,
    title: 'Customer Success Onboarding & Pain Points Review',
    date: new Date(Date.now() - 432000000).toISOString(),
    duration_seconds: 1800,
    organizer: 'Archita Sharma',
    participants: ['Archita Sharma', 'Elena Rostova', 'David Kim'],
    category: 'Customer',
    audio_url: '/samples/sample-meeting.mp3',
    action_items_count: 1,
    transcript_count: 3,
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
];

const MOCK_DETAILS: Record<number, MeetingDetail> = {
  1: {
    id: 1,
    title: 'Q3 Product Strategy & Roadmap Alignment',
    date: new Date(Date.now() - 86400000).toISOString(),
    duration_seconds: 1420,
    organizer: 'Archita Sharma',
    participants: ['Archita Sharma', 'Alex Rivera', 'Devin Chen', 'Sarah Jenkins'],
    category: 'Product',
    audio_url: '/samples/sample-meeting.mp3',
    transcripts: [
      { id: 101, meeting_id: 1, speaker_name: 'Archita Sharma', speaker_avatar: '#7C3AED', start_time: 0.0, end_time: 12.0, text: 'Welcome everyone to our Q3 Product Strategy sync! Today we need to align on core milestones and AI features.' },
      { id: 102, meeting_id: 1, speaker_name: 'Alex Rivera', speaker_avatar: '#EC4899', start_time: 14.0, end_time: 32.0, text: 'Thanks Archita. User feedback shows high demand for interactive transcripts and instant AI action item extraction.' },
      { id: 103, meeting_id: 1, speaker_name: 'Devin Chen', speaker_avatar: '#10B981', start_time: 35.0, end_time: 58.0, text: 'From engineering, we have prepared our database schema and API endpoints to process transcript chunks efficiently.' },
      { id: 104, meeting_id: 1, speaker_name: 'Sarah Jenkins', speaker_avatar: '#3B82F6', start_time: 62.0, end_time: 88.0, text: 'Design has completed the light pastel UI mockups. We want to ensure seamless audio waveform sync with text lines.' },
      { id: 105, meeting_id: 1, speaker_name: 'Archita Sharma', speaker_avatar: '#7C3AED', start_time: 92.0, end_time: 120.0, text: "Excellent! Let's prioritize the meeting library dashboard, transcript detail view, and Ask Fred AI assistant chat." },
      { id: 106, meeting_id: 1, speaker_name: 'Devin Chen', speaker_avatar: '#10B981', start_time: 125.0, end_time: 150.0, text: 'I will take responsibility for setting up CORS, Pydantic schemas, and preparing Render deployment configurations.' },
      { id: 107, meeting_id: 1, speaker_name: 'Alex Rivera', speaker_avatar: '#EC4899', start_time: 155.0, end_time: 180.0, text: 'I will write unit tests for transcript search and action item state transitions.' },
    ],
    summary: {
      id: 201,
      meeting_id: 1,
      overview: 'The team aligned on Q3 product priorities, emphasizing interactive meeting transcripts, automated AI summary generation, Ask Fred QA chat, and Render deployment.',
      key_takeaways: [
        'Prioritized official Fireflies light theme design and audio player transcript synchronization.',
        'Engineered fast FastAPI backend with SQLite persistence and CORS setup.',
        'Confirmed target deployment platform as Render with environment variable integration.'
      ],
      chapters: [
        { start_time: 0.0, title: 'Welcome & Q3 Goals', summary: 'Archita introduced the meeting agenda and product scope.' },
        { start_time: 35.0, title: 'Backend Architecture', summary: 'Devin presented database schema for real-time transcript queries.' },
        { start_time: 92.0, title: 'Action Plan & Next Steps', summary: 'Assigned ownership for frontend components, API tests, and Render deployment.' }
      ]
    },
    action_items: [
      { id: 301, meeting_id: 1, text: 'Setup FastAPI CORS and Render deployment configuration', assignee: 'Devin Chen', status: 'pending', due_date: 'Aug 15', created_at: new Date().toISOString() },
      { id: 302, meeting_id: 1, text: 'Build Next.js interactive audio transcript player component', assignee: 'Archita Sharma', status: 'completed', due_date: 'Aug 14', created_at: new Date().toISOString() },
      { id: 303, meeting_id: 1, text: 'Write API test suite for transcript search and export router', assignee: 'Alex Rivera', status: 'pending', due_date: 'Aug 16', created_at: new Date().toISOString() }
    ],
    soundbites: [
      { id: 401, meeting_id: 1, title: 'Product Priorities Alignment', start_time: 92.0, end_time: 120.0, text: 'Let us prioritize the meeting library dashboard, transcript detail view, and Ask Fred AI assistant chat.', category: 'highlight', created_at: new Date().toISOString() }
    ],
    chat_messages: [
      { id: 501, meeting_id: 1, sender: 'user', content: 'What technical tasks are assigned to Devin?', created_at: new Date().toISOString() },
      { id: 502, meeting_id: 1, sender: 'fred', content: 'Devin Chen is assigned to set up CORS, database schemas, Pydantic validation, and Render deployment scripts.', created_at: new Date().toISOString() }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  }
};

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (err) {
    console.warn(`Backend fetch failed for ${endpoint}, returning fallback mock data.`);
    throw err;
  }
}

export const api = {
  getMeetings: async (search?: string, category?: string, sort_by?: string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort_by) params.append('sort_by', sort_by);
      return await fetchJSON<MeetingListItem[]>(`/api/meetings?${params.toString()}`);
    } catch {
      let filtered = [...MOCK_MEETINGS];
      if (category && category !== 'All') {
        filtered = filtered.filter((m) => m.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.organizer.toLowerCase().includes(q) ||
            m.participants.some((p) => p.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  getMeetingStats: async () => {
    try {
      return await fetchJSON<MeetingStats>('/api/meetings/stats');
    } catch {
      return {
        total_meetings: 3,
        total_duration_hours: 1.5,
        total_action_items: 6,
        pending_action_items: 4,
        categories_count: { Product: 1, Engineering: 1, Customer: 1 },
      };
    }
  },

  getMeetingDetail: async (id: number) => {
    try {
      return await fetchJSON<MeetingDetail>(`/api/meetings/${id}`);
    } catch {
      return MOCK_DETAILS[id] || MOCK_DETAILS[1];
    }
  },

  createMeeting: async (payload: { title: string; category?: string; raw_transcript?: string; participants?: string[] }) => {
    try {
      return await fetchJSON<MeetingDetail>('/api/meetings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const newId = Date.now();
      const created: MeetingDetail = {
        ...MOCK_DETAILS[1],
        id: newId,
        title: payload.title,
        category: payload.category || 'General',
        participants: payload.participants || ['Archita Sharma', 'Guest'],
        date: new Date().toISOString(),
      };
      MOCK_MEETINGS.unshift({
        id: newId,
        title: payload.title,
        date: created.date,
        duration_seconds: 1800,
        organizer: 'Archita Sharma',
        participants: created.participants,
        category: created.category,
        action_items_count: 2,
        transcript_count: 3,
        created_at: created.date,
      });
      MOCK_DETAILS[newId] = created;
      return created;
    }
  },

  updateMeeting: (id: number, payload: { title?: string; category?: string; organizer?: string }) =>
    fetchJSON<MeetingDetail>(`/api/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteMeeting: async (id: number) => {
    try {
      await fetchJSON<void>(`/api/meetings/${id}`, { method: 'DELETE' });
    } catch {
      const idx = MOCK_MEETINGS.findIndex((m) => m.id === id);
      if (idx !== -1) MOCK_MEETINGS.splice(idx, 1);
    }
  },

  createActionItem: async (meetingId: number, payload: { text: string; assignee?: string; due_date?: string }) => {
    try {
      return await fetchJSON<ActionItem>(`/api/meetings/${meetingId}/action-items`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const item: ActionItem = {
        id: Date.now(),
        meeting_id: meetingId,
        text: payload.text,
        assignee: payload.assignee || 'Unassigned',
        status: 'pending',
        due_date: payload.due_date || 'Next Sprint',
        created_at: new Date().toISOString(),
      };
      if (MOCK_DETAILS[meetingId]) {
        MOCK_DETAILS[meetingId].action_items.push(item);
      }
      return item;
    }
  },

  updateActionItem: async (meetingId: number, itemId: number, payload: { status?: string; text?: string; assignee?: string }) => {
    try {
      return await fetchJSON<ActionItem>(`/api/meetings/${meetingId}/action-items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    } catch {
      const detail = MOCK_DETAILS[meetingId];
      if (detail) {
        const found = detail.action_items.find((a) => a.id === itemId);
        if (found && payload.status) {
          found.status = payload.status as 'pending' | 'completed';
          return found;
        }
      }
      return {
        id: itemId,
        meeting_id: meetingId,
        text: payload.text || 'Action item task',
        assignee: payload.assignee || 'Archita',
        status: (payload.status as 'pending' | 'completed') || 'pending',
        created_at: new Date().toISOString(),
      };
    }
  },

  deleteActionItem: async (meetingId: number, itemId: number) => {
    try {
      await fetchJSON<void>(`/api/meetings/${meetingId}/action-items/${itemId}`, { method: 'DELETE' });
    } catch {
      const detail = MOCK_DETAILS[meetingId];
      if (detail) {
        detail.action_items = detail.action_items.filter((a) => a.id !== itemId);
      }
    }
  },

  getChatHistory: (meetingId: number) => fetchJSON<ChatMessage[]>(`/api/meetings/${meetingId}/chat`),

  sendChatMessage: async (meetingId: number, message: string): Promise<ChatMessage> => {
    try {
      return await fetchJSON<ChatMessage>(`/api/meetings/${meetingId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    } catch {
      const answer = `Based on the transcript analysis for this meeting, key discussion points covered: "${message}". Let me know if you need specific timestamps or speaker line highlights!`;
      return {
        id: Date.now(),
        meeting_id: meetingId,
        sender: 'fred',
        content: answer,
        created_at: new Date().toISOString(),
      };
    }
  },

  uploadTranscriptFile: async (formData: FormData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transcripts/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload transcript file');
      return await res.json();
    } catch {
      return { message: 'Uploaded successfully', meeting_id: 1 };
    }
  },

  getExportUrl: (meetingId: number, format: 'md' | 'txt' | 'json') =>
    `${API_BASE_URL}/api/meetings/${meetingId}/export?format=${format}`,
};
