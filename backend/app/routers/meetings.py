import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.database import get_db
from app import models, schemas
from app.services.parser import parse_transcript_text
from app.services.ai_service import generate_summary_data

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

@router.get("", response_model=List[schemas.MeetingListItem])
def list_meetings(
    search: Optional[str] = Query(None, description="Search by title or participant"),
    category: Optional[str] = Query(None, description="Filter by category"),
    sort_by: Optional[str] = Query("date_desc", description="date_desc, date_asc, title_asc, duration_desc"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Meeting)

    if category and category.lower() != "all":
        query = query.filter(models.Meeting.category == category)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (models.Meeting.title.ilike(search_pattern)) |
            (models.Meeting.participants.ilike(search_pattern)) |
            (models.Meeting.organizer.ilike(search_pattern))
        )

    # Sorting
    if sort_by == "date_asc":
        query = query.order_by(asc(models.Meeting.date))
    elif sort_by == "title_asc":
        query = query.order_by(asc(models.Meeting.title))
    elif sort_by == "duration_desc":
        query = query.order_by(desc(models.Meeting.duration_seconds))
    else:
        query = query.order_by(desc(models.Meeting.date))

    meetings = query.all()

    items = []
    for m in meetings:
        participants_list = json.loads(m.participants) if m.participants else []
        action_items_cnt = db.query(models.ActionItem).filter(models.ActionItem.meeting_id == m.id).count()
        transcript_cnt = db.query(models.Transcript).filter(models.Transcript.meeting_id == m.id).count()
        items.append(schemas.MeetingListItem(
            id=m.id,
            title=m.title,
            date=m.date,
            duration_seconds=m.duration_seconds,
            organizer=m.organizer,
            participants=participants_list,
            category=m.category,
            audio_url=m.audio_url,
            action_items_count=action_items_cnt,
            transcript_count=transcript_cnt,
            created_at=m.created_at
        ))
    return items


@router.get("/stats", response_model=schemas.MeetingStats)
def get_stats(db: Session = Depends(get_db)):
    meetings = db.query(models.Meeting).all()
    total_meetings = len(meetings)
    total_duration_sec = sum(m.duration_seconds for m in meetings)
    
    action_items = db.query(models.ActionItem).all()
    total_actions = len(action_items)
    pending_actions = len([a for a in action_items if a.status == "pending"])
    
    categories = {}
    for m in meetings:
        categories[m.category] = categories.get(m.category, 0) + 1

    return schemas.MeetingStats(
        total_meetings=total_meetings,
        total_duration_hours=round(total_duration_sec / 3600, 1),
        total_action_items=total_actions,
        pending_action_items=pending_actions,
        categories_count=categories
    )


@router.get("/{meeting_id}", response_model=schemas.MeetingDetail)
def get_meeting_detail(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participants_list = json.loads(meeting.participants) if meeting.participants else []

    # Format summary object
    summary_out = None
    if meeting.summary:
        summary_out = schemas.SummaryOut(
            id=meeting.summary.id,
            meeting_id=meeting.summary.meeting_id,
            overview=meeting.summary.overview,
            key_takeaways=json.loads(meeting.summary.key_takeaways) if meeting.summary.key_takeaways else [],
            chapters=[schemas.Chapter(**c) for c in json.loads(meeting.summary.chapters)] if meeting.summary.chapters else []
        )

    # Format transcript items sorted by start_time
    transcripts_sorted = sorted(meeting.transcripts, key=lambda t: t.start_time)

    return schemas.MeetingDetail(
        id=meeting.id,
        title=meeting.title,
        date=meeting.date,
        duration_seconds=meeting.duration_seconds,
        organizer=meeting.organizer,
        participants=participants_list,
        category=meeting.category,
        audio_url=meeting.audio_url,
        transcripts=[schemas.TranscriptOut.model_validate(t) for t in transcripts_sorted],
        summary=summary_out,
        action_items=[schemas.ActionItemOut.model_validate(a) for a in meeting.action_items],
        soundbites=[schemas.SoundbiteOut.model_validate(s) for s in meeting.soundbites],
        chat_messages=[schemas.ChatMessageOut.model_validate(c) for c in meeting.chat_messages],
        created_at=meeting.created_at,
        updated_at=meeting.updated_at
    )


@router.post("", response_model=schemas.MeetingDetail, status_code=status.HTTP_201_CREATED)
def create_meeting(payload: schemas.MeetingCreate, db: Session = Depends(get_db)):
    participants_str = json.dumps(payload.participants if payload.participants else ["Archita Sharma", "Guest"])

    new_meeting = models.Meeting(
        title=payload.title,
        date=payload.date if payload.date else models.datetime.utcnow(),
        duration_seconds=payload.duration_seconds or 1800,
        organizer=payload.organizer or "Archita Sharma",
        participants=participants_str,
        category=payload.category or "General",
        audio_url=payload.audio_url or "/samples/sample-meeting.mp3"
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    # If raw_transcript provided, parse and synthesize summary
    parsed_transcripts = []
    if payload.raw_transcript:
        parsed_transcripts = parse_transcript_text(payload.raw_transcript, payload.participants)
    else:
        # Generate default placeholder transcript lines
        parsed_transcripts = [
            {"speaker_name": "Archita Sharma", "speaker_avatar": "#6366F1", "start_time": 0.0, "end_time": 10.0, "text": f"Welcome everyone to our '{payload.title}' meeting.", "sentiment": "positive"},
            {"speaker_name": "Alex Rivera", "speaker_avatar": "#8B5CF6", "start_time": 12.0, "end_time": 25.0, "text": "Thanks Archita! Let's go over the core agenda and key deliverables.", "sentiment": "neutral"},
            {"speaker_name": "Devin Chen", "speaker_avatar": "#EC4899", "start_time": 27.0, "end_time": 45.0, "text": "I will take responsibility for pushing our code updates and documentation.", "sentiment": "positive"}
        ]

    for t_data in parsed_transcripts:
        t_obj = models.Transcript(
            meeting_id=new_meeting.id,
            speaker_name=t_data["speaker_name"],
            speaker_avatar=t_data.get("speaker_avatar", "#6366F1"),
            start_time=t_data["start_time"],
            end_time=t_data["end_time"],
            text=t_data["text"],
            sentiment=t_data.get("sentiment", "neutral")
        )
        db.add(t_obj)

    db.commit()

    # Generate AI summary and action items
    summary_data = generate_summary_data(parsed_transcripts, payload.title)
    
    summary_obj = models.Summary(
        meeting_id=new_meeting.id,
        overview=summary_data["overview"],
        key_takeaways=json.dumps(summary_data["key_takeaways"]),
        chapters=json.dumps(summary_data["chapters"])
    )
    db.add(summary_obj)

    for ai in summary_data["action_items"]:
        ai_obj = models.ActionItem(
            meeting_id=new_meeting.id,
            text=ai["text"],
            assignee=ai["assignee"],
            status=ai["status"],
            due_date=ai["due_date"]
        )
        db.add(ai_obj)

    db.commit()
    db.refresh(new_meeting)

    return get_meeting_detail(new_meeting.id, db)


@router.put("/{meeting_id}", response_model=schemas.MeetingDetail)
def update_meeting(meeting_id: int, payload: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    if payload.title is not None:
        meeting.title = payload.title
    if payload.organizer is not None:
        meeting.organizer = payload.organizer
    if payload.category is not None:
        meeting.category = payload.category
    if payload.audio_url is not None:
        meeting.audio_url = payload.audio_url
    if payload.participants is not None:
        meeting.participants = json.dumps(payload.participants)

    meeting.updated_at = models.datetime.utcnow()
    db.commit()
    return get_meeting_detail(meeting_id, db)


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    db.delete(meeting)
    db.commit()
    return None
