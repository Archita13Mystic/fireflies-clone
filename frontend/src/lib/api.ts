import axios from "axios";
import { Meeting, MeetingDetail, ActionItem } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  getMeetings: async (search?: string, sort?: string, participant?: string): Promise<Meeting[]> => {
    const response = await apiClient.get<Meeting[]>("/api/meetings", {
      params: { search, sort, participant },
    });
    return response.data;
  },

  createMeeting: async (payload: {
    title: string;
    date: string;
    duration: number;
    participants: string[];
    audio_url?: string;
    transcript_text?: string;
  }): Promise<Meeting> => {
    const response = await apiClient.post<Meeting>("/api/meetings", payload);
    return response.data;
  },

  getMeetingDetail: async (id: number): Promise<MeetingDetail> => {
    const response = await apiClient.get<MeetingDetail>(`/api/meetings/${id}`);
    return response.data;
  },

  generateSummary: async (id: number): Promise<MeetingDetail> => {
    const response = await apiClient.post<MeetingDetail>(`/api/meetings/${id}/summarize`);
    return response.data;
  },

  updateMeeting: async (id: number, payload: {
    title?: string;
    participants?: string[];
    audio_url?: string;
    duration?: number;
    date?: string;
  }): Promise<Meeting> => {
    const response = await apiClient.put<Meeting>(`/api/meetings/${id}`, payload);
    return response.data;
  },

  deleteMeeting: async (id: number): Promise<{ deleted: boolean }> => {
    const response = await apiClient.delete<{ deleted: boolean }>(`/api/meetings/${id}`);
    return response.data;
  },

  uploadTranscript: async (id: number, file: File): Promise<{ inserted: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ inserted: number }>(
      `/api/meetings/${id}/transcript/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  createActionItem: async (
    meetingId: number,
    payload: { text: string; assignee?: string; due_date?: string }
  ): Promise<ActionItem> => {
    const response = await apiClient.post<ActionItem>(
      `/api/meetings/${meetingId}/action-items`,
      payload
    );
    return response.data;
  },

  updateActionItem: async (
    actionItemId: number,
    payload: { text?: string; assignee?: string; due_date?: string; completed?: boolean }
  ): Promise<ActionItem> => {
    const response = await apiClient.put<ActionItem>(
      `/api/action-items/${actionItemId}`,
      payload
    );
    return response.data;
  },

  deleteActionItem: async (actionItemId: number): Promise<{ deleted: boolean }> => {
    const response = await apiClient.delete<{ deleted: boolean }>(
      `/api/action-items/${actionItemId}`
    );
    return response.data;
  },

};
