import { MeetingListItem, MeetingDetail, MeetingStats, ActionItem, ChatMessage } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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
    console.error(`Failed fetching ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Meetings
  getMeetings: (search?: string, category?: string, sort_by?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (sort_by) params.append('sort_by', sort_by);
    return fetchJSON<MeetingListItem[]>(`/api/meetings?${params.toString()}`);
  },

  getMeetingStats: () => fetchJSON<MeetingStats>('/api/meetings/stats'),

  getMeetingDetail: (id: number) => fetchJSON<MeetingDetail>(`/api/meetings/${id}`),

  createMeeting: (payload: { title: string; category?: string; raw_transcript?: string; participants?: string[] }) =>
    fetchJSON<MeetingDetail>('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateMeeting: (id: number, payload: { title?: string; category?: string; organizer?: string }) =>
    fetchJSON<MeetingDetail>(`/api/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteMeeting: (id: number) =>
    fetchJSON<void>(`/api/meetings/${id}`, {
      method: 'DELETE',
    }),

  // Action Items
  createActionItem: (meetingId: number, payload: { text: string; assignee?: string; due_date?: string }) =>
    fetchJSON<ActionItem>(`/api/meetings/${meetingId}/action-items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateActionItem: (meetingId: number, itemId: number, payload: { status?: string; text?: string; assignee?: string }) =>
    fetchJSON<ActionItem>(`/api/meetings/${meetingId}/action-items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteActionItem: (meetingId: number, itemId: number) =>
    fetchJSON<void>(`/api/meetings/${meetingId}/action-items/${itemId}`, {
      method: 'DELETE',
    }),

  // Ask Fred Chat
  getChatHistory: (meetingId: number) => fetchJSON<ChatMessage[]>(`/api/meetings/${meetingId}/chat`),

  sendChatMessage: (meetingId: number, message: string) =>
    fetchJSON<ChatMessage>(`/api/meetings/${meetingId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // File Upload
  uploadTranscriptFile: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/api/transcripts/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload transcript file');
    return await res.json();
  },

  // Export URL helper
  getExportUrl: (meetingId: number, format: 'md' | 'txt' | 'json') =>
    `${API_BASE_URL}/api/meetings/${meetingId}/export?format=${format}`,
};
