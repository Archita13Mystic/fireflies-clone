from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# --- Transcript Schemas ---
class TranscriptLineBase(BaseModel):
    speaker: str
    text: str
    start_time: float
    end_time: float
    sequence: int

class TranscriptLineCreate(TranscriptLineBase):
    pass

class TranscriptLineResponse(TranscriptLineBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True

# --- Summary Schemas ---
class OutlineChapterBase(BaseModel):
    title: str
    start_time: float

class SummaryBase(BaseModel):
    overview: str
    key_topics: List[str]
    outline: List[OutlineChapterBase]

class SummaryCreate(SummaryBase):
    pass

class SummaryResponse(BaseModel):
    id: int
    meeting_id: int
    overview: str
    key_topics: List[str]
    outline: List[OutlineChapterBase]

    class Config:
        from_attributes = True

# --- Action Item Schemas ---
class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    due_date: Optional[str] = None

class ActionItemCreate(ActionItemBase):
    pass

class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None

class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Meeting Schemas ---
class MeetingBase(BaseModel):
    title: str
    date: datetime
    duration: int
    participants: List[str]
    audio_url: Optional[str] = None

class MeetingCreate(MeetingBase):
    transcript_text: Optional[str] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    duration: Optional[int] = None
    participants: Optional[List[str]] = None
    audio_url: Optional[str] = None

class MeetingListItemResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration: int
    participants: List[str]
    transcript_count: int
    has_summary: bool
    created_at: datetime

    class Config:
        from_attributes = True

class MeetingDetailResponse(MeetingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    transcript: List[TranscriptLineResponse]
    summary: Optional[SummaryResponse] = None
    action_items: List[ActionItemResponse]

    class Config:
        from_attributes = True


