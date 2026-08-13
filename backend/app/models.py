from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    duration_seconds = Column(Integer, default=1800) # Default 30 mins
    organizer = Column(String(255), default="Archita Sharma")
    participants = Column(Text, default="[]") # JSON array string
    category = Column(String(100), default="General", index=True)
    audio_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    transcripts = relationship("Transcript", back_populates="meeting", cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    soundbites = relationship("Soundbite", back_populates="meeting", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="meeting", cascade="all, delete-orphan")


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    speaker_name = Column(String(255), nullable=False)
    speaker_avatar = Column(String(100), default="#6366F1") # Color code or image
    start_time = Column(Float, nullable=False, index=True) # In seconds
    end_time = Column(Float, nullable=False)
    text = Column(Text, nullable=False)
    sentiment = Column(String(50), default="neutral")

    meeting = relationship("Meeting", back_populates="transcripts")


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, unique=True, index=True)
    overview = Column(Text, nullable=False)
    key_takeaways = Column(Text, default="[]") # JSON string array
    chapters = Column(Text, default="[]") # JSON string array of {start_time, title, summary}

    meeting = relationship("Meeting", back_populates="summary")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    text = Column(Text, nullable=False)
    assignee = Column(String(255), default="Unassigned")
    status = Column(String(50), default="pending") # "pending" or "completed"
    due_date = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="action_items")


class Soundbite(Base):
    __tablename__ = "soundbites"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String(100), default="highlight") # "highlight", "action", "question"
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="soundbites")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    sender = Column(String(50), nullable=False) # "user" or "fred"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="chat_messages")
