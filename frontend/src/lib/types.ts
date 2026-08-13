export interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: number;        // seconds
  participants: string[];
  audio_url: string | null;
  transcript_count: number;
  has_summary: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MeetingDetail extends Meeting {
  transcript: TranscriptLine[];
  summary: Summary | null;
  action_items: ActionItem[];
}

export interface TranscriptLine {
  id: number;
  meeting_id: number;
  speaker: string;
  text: string;
  start_time: number;      // seconds
  end_time: number;
  sequence: number;
}

export interface Summary {
  id: number;
  meeting_id: number;
  overview: string;
  key_topics: string[];
  outline: OutlineChapter[];
}

export interface OutlineChapter {
  title: string;
  start_time: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee: string | null;
  due_date: string | null;  // YYYY-MM-DD
  completed: boolean;
  created_at: string;
}


