from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.services.ai_service import answer_ask_fred_query

router = APIRouter(prefix="/api/meetings/{meeting_id}/chat", tags=["chat"])

@router.get("", response_model=List[schemas.ChatMessageOut])
def get_chat_history(meeting_id: int, db: Session = Depends(get_db)):
    return db.query(models.ChatMessage).filter(models.ChatMessage.meeting_id == meeting_id).order_by(models.ChatMessage.created_at.asc()).all()

@router.post("", response_model=schemas.ChatMessageOut)
def send_chat_message(meeting_id: int, payload: schemas.ChatMessageCreate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Save user message
    user_msg = models.ChatMessage(
        meeting_id=meeting_id,
        sender="user",
        content=payload.message
    )
    db.add(user_msg)
    db.commit()

    # Generate Ask Fred AI response
    transcripts_list = [
        {"speaker_name": t.speaker_name, "start_time": t.start_time, "text": t.text}
        for t in meeting.transcripts
    ]
    
    answer_text = answer_ask_fred_query(payload.message, transcripts_list, meeting.title)

    fred_msg = models.ChatMessage(
        meeting_id=meeting_id,
        sender="fred",
        content=answer_text
    )
    db.add(fred_msg)
    db.commit()
    db.refresh(fred_msg)

    return fred_msg
