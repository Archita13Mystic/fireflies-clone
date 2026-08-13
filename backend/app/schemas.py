from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Transcript Schemas
class TranscriptBase(BaseModel):
    speaker_name: str
    speaker_avatar: Optional[str] = "#6366F1"
    start_time: float
    end_time: float
    text: str
    sentiment: Optional[str] = "neutral"

class TranscriptCreate(TranscriptBase):
    pass

class TranscriptOut(TranscriptBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True

# Chapter Schema
class Chapter(BaseModel):
    start_time: float
    title: str
    summary: str

# Summary Schemas
class SummaryBase(BaseModel):
    overview: str
    key_takeaways: List[str] = []
    chapters: List[Chapter] = []

class SummaryCreate(SummaryBase):
    pass

class SummaryOut(SummaryBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True

# Action Item Schemas
class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = "Unassigned"
    status: Optional[str] = "pending"
    due_date: Optional[str] = None

class ActionItemCreate(ActionItemBase):
    pass

class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None

class ActionItemOut(ActionItemBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Soundbite Schemas
class SoundbiteBase(BaseModel):
    title: str
    start_time: float
    end_time: float
    text: str
    category: Optional[str] = "highlight"

class SoundbiteCreate(SoundbiteBase):
    pass

class SoundbiteOut(SoundbiteBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Schemas
class ChatMessageBase(BaseModel):
    sender: str
    content: str

class ChatMessageCreate(BaseModel):
    message: str

class ChatMessageOut(ChatMessageBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Meeting Schemas
class MeetingBase(BaseModel):
    title: str
    date: Optional[datetime] = None
    duration_seconds: Optional[int] = 1800
    organizer: Optional[str] = "Archita Sharma"
    participants: List[str] = []
    category: Optional[str] = "General"
    audio_url: Optional[str] = None

class MeetingCreate(MeetingBase):
    raw_transcript: Optional[str] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    organizer: Optional[str] = None
    participants: Optional[List[str]] = None
    category: Optional[str] = None
    audio_url: Optional[str] = None

class MeetingListItem(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    organizer: str
    participants: List[str]
    category: str
    audio_url: Optional[str]
    action_items_count: int = 0
    transcript_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class MeetingDetail(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    organizer: str
    participants: List[str]
    category: str
    audio_url: Optional[str]
    transcripts: List[TranscriptOut] = []
    summary: Optional[SummaryOut] = None
    action_items: List[ActionItemOut] = []
    soundbites: List[SoundbiteOut] = []
    chat_messages: List[ChatMessageOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MeetingStats(BaseModel):
    total_meetings: int
    total_duration_hours: float
    total_action_items: int
    pending_action_items: int
    categories_count: dict
