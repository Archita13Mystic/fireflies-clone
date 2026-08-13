export interface Transcript {
  id: number;
  meeting_id: number;
  speaker_name: string;
  speaker_avatar?: string;
  start_time: number;
  end_time: number;
  text: string;
  sentiment?: string;
}

export interface Chapter {
  start_time: number;
  title: string;
  summary: string;
}

export interface Summary {
  id: number;
  meeting_id: number;
  overview: string;
  key_takeaways: string[];
  chapters: Chapter[];
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee: string;
  status: 'pending' | 'completed';
  due_date?: string;
  created_at: string;
}

export interface Soundbite {
  id: number;
  meeting_id: number;
  title: string;
  start_time: number;
  end_time: number;
  text: string;
  category: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  meeting_id: number;
  sender: 'user' | 'fred';
  content: string;
  created_at: string;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  organizer: string;
  participants: string[];
  category: string;
  audio_url?: string;
  action_items_count: number;
  transcript_count: number;
  created_at: string;
}

export interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  organizer: string;
  participants: string[];
  category: string;
  audio_url?: string;
  transcripts: Transcript[];
  summary?: Summary;
  action_items: ActionItem[];
  soundbites: Soundbite[];
  chat_messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface MeetingStats {
  total_meetings: number;
  total_duration_hours: number;
  total_action_items: number;
  pending_action_items: number;
  categories_count: Record<string, number>;
}
