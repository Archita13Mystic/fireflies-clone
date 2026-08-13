import json
import re
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

def parse_pasted_transcript(transcript_text: str) -> List[dict]:
    lines = transcript_text.strip().split("\n")
    parsed_lines = []
    current_time = 0.0
    sequence = 1

    for line in lines:
        line = line.strip()
        if not line:
            continue

        match_ts = re.match(r"^([^:]+?)\s*\((\d+):(\d+)\)\s*:\s*(.*)$", line)
        if match_ts:
            speaker = match_ts.group(1).strip()
            mins = int(match_ts.group(2))
            secs = int(match_ts.group(3))
            start_time = float(mins * 60 + secs)
            text = match_ts.group(4).strip()
            end_time = start_time + 15.0
            current_time = end_time
            parsed_lines.append({
                "speaker": speaker,
                "text": text,
                "start_time": start_time,
                "end_time": end_time,
                "sequence": sequence
            })
            sequence += 1
            continue

        match_no_ts = re.match(r"^([^:]+?)\s*:\s*(.*)$", line)
        if match_no_ts:
            speaker = match_no_ts.group(1).strip()
            text = match_no_ts.group(2).strip()
            start_time = current_time
            end_time = start_time + 30.0
            current_time = end_time
            parsed_lines.append({
                "speaker": speaker,
                "text": text,
                "start_time": start_time,
                "end_time": end_time,
                "sequence": sequence
            })
            sequence += 1
            continue

        start_time = current_time
        end_time = start_time + 30.0
        current_time = end_time
        parsed_lines.append({
            "speaker": "Speaker 1",
            "text": line,
            "start_time": start_time,
            "end_time": end_time,
            "sequence": sequence
        })
        sequence += 1

    return parsed_lines

def generate_ai_summary(meeting_title: str, participants: list, transcripts: list):
    speakers = list({t.speaker for t in transcripts})
    all_text = " ".join([t.text for t in transcripts])
    
    lead_speaker = speakers[0] if speakers else "The team"
    participants_str = ", ".join(participants) if participants else "Team members"
    
    overview = (
        f"In this sync on '{meeting_title}', {participants_str} discussed key updates, technical milestones, and project deliverables. "
        f"The conversation opened with {lead_speaker} setting the agenda and reviewing current progress. "
        f"Key technical trade-offs, architecture decisions, and workflow dependencies were evaluated to ensure timely execution. "
        f"The team concluded with agreed action items and ownership assignments for next steps."
    )
    
    topic_keywords = [
        ("Architecture", ["architecture", "backend", "database", "api", "schema", "sqlite", "fastapi"]),
        ("Frontend & UX", ["frontend", "ui", "ux", "react", "next.js", "tailwind", "design", "css", "component"]),
        ("Sprint Planning", ["sprint", "roadmap", "timeline", "milestone", "priority", "q3", "release"]),
        ("Testing & QA", ["test", "testing", "unit test", "bug", "issue", "qa", "validation"]),
        ("Deployment", ["deploy", "render", "docker", "production", "ci/cd", "staging", "server"]),
        ("Action Items", ["action item", "todo", "follow up", "assign", "deliverable"])
    ]
    detected_topics = []
    lower_text = all_text.lower()
    for topic, keywords in topic_keywords:
        if any(k in lower_text for k in keywords):
            detected_topics.append(topic)
    if not detected_topics:
        detected_topics = ["General Sync", "Team Collaboration", "Project Milestones"]

    outline = []
    if transcripts:
        first_t = float(transcripts[0].start_time)
        outline.append({
            "title": f"Introduction & Agenda Overview ({speakers[0] if speakers else 'Team'})",
            "start_time": first_t
        })
        if len(transcripts) >= 3:
            mid_idx = len(transcripts) // 2
            mid_t = float(transcripts[mid_idx].start_time)
            outline.append({
                "title": f"Core Technical Discussion & Review ({transcripts[mid_idx].speaker})",
                "start_time": mid_t
            })
        if len(transcripts) >= 5:
            last_idx = int(len(transcripts) * 0.8)
            last_t = float(transcripts[last_idx].start_time)
            outline.append({
                "title": f"Action Items & Next Milestones ({transcripts[last_idx].speaker})",
                "start_time": last_t
            })

    action_triggers = ["will", "need to", "action item", "follow up", "create", "assign", "deploy", "review", "schedule", "fix", "send", "update", "prepare", "test", "finalize"]
    action_items_data = []
    
    today = datetime.utcnow()
    due_dates = [
        (today + timedelta(days=2)).strftime("%Y-%m-%d"),
        (today + timedelta(days=4)).strftime("%Y-%m-%d"),
        (today + timedelta(days=7)).strftime("%Y-%m-%d"),
    ]
    
    for t in transcripts:
        text_lower = t.text.lower()
        if any(trigger in text_lower for trigger in action_triggers):
            clean_task = t.text
            if len(clean_task) > 120:
                clean_task = clean_task[:117] + "..."
            action_items_data.append({
                "text": clean_task,
                "assignee": t.speaker,
                "due_date": due_dates[len(action_items_data) % len(due_dates)]
            })
            if len(action_items_data) >= 5:
                break

    if not action_items_data and speakers:
        action_items_data.append({
            "text": f"Follow up on {meeting_title} deliverables and verify test coverage",
            "assignee": speakers[0],
            "due_date": due_dates[0]
        })

    return {
        "overview": overview,
        "key_topics": detected_topics,
        "outline": outline,
        "action_items": action_items_data
    }

@router.get("", response_model=List[schemas.MeetingListItemResponse])
def get_meetings(
    search: Optional[str] = Query(None),
    sort: str = Query("date_desc"),
    participant: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Meeting)

    if search:
        query = query.filter(models.Meeting.title.ilike(f"%{search}%"))

    if participant:
        query = query.filter(models.Meeting.participants.ilike(f"%{participant}%"))

    meetings = query.all()

    results = []
    for m in meetings:
        participants_list = json.loads(m.participants)
        transcript_count = db.query(models.Transcript).filter(models.Transcript.meeting_id == m.id).count()
        has_summary = db.query(models.Summary).filter(models.Summary.meeting_id == m.id).first() is not None

        results.append(schemas.MeetingListItemResponse(
            id=m.id,
            title=m.title,
            date=m.date,
            duration=m.duration,
            participants=participants_list,
            transcript_count=transcript_count,
            has_summary=has_summary,
            created_at=m.created_at
        ))

    if sort == "date_desc":
        results.sort(key=lambda x: x.date, reverse=True)
    elif sort == "date_asc":
        results.sort(key=lambda x: x.date)
    elif sort == "title_asc":
        results.sort(key=lambda x: x.title.lower())

    return results

@router.post("", response_model=schemas.MeetingListItemResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(get_db)):
    db_meeting = models.Meeting(
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration * 60,
        participants=json.dumps(meeting.participants),
        audio_url=meeting.audio_url if meeting.audio_url else "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)

    if meeting.transcript_text:
        parsed_lines = parse_pasted_transcript(meeting.transcript_text)
        for line in parsed_lines:
            db_t = models.Transcript(
                meeting_id=db_meeting.id,
                speaker=line["speaker"],
                text=line["text"],
                start_time=line["start_time"],
                end_time=line["end_time"],
                sequence=line["sequence"]
            )
            db.add(db_t)
        db.commit()

        # Auto-generate AI summary & action items
        transcripts = db.query(models.Transcript).filter(models.Transcript.meeting_id == db_meeting.id).order_by(models.Transcript.sequence).all()
        if transcripts:
            summary_data = generate_ai_summary(db_meeting.title, meeting.participants, transcripts)
            db_summary = models.Summary(
                meeting_id=db_meeting.id,
                overview=summary_data["overview"],
                key_topics=json.dumps(summary_data["key_topics"]),
                outline=json.dumps(summary_data["outline"])
            )
            db.add(db_summary)

            for ai in summary_data["action_items"]:
                db_action = models.ActionItem(
                    meeting_id=db_meeting.id,
                    text=ai["text"],
                    assignee=ai["assignee"],
                    due_date=ai["due_date"],
                    completed=False
                )
                db.add(db_action)
            db.commit()

    transcript_count = db.query(models.Transcript).filter(models.Transcript.meeting_id == db_meeting.id).count()
    has_summary = db.query(models.Summary).filter(models.Summary.meeting_id == db_meeting.id).first() is not None

    return schemas.MeetingListItemResponse(
        id=db_meeting.id,
        title=db_meeting.title,
        date=db_meeting.date,
        duration=db_meeting.duration,
        participants=meeting.participants,
        transcript_count=transcript_count,
        has_summary=has_summary,
        created_at=db_meeting.created_at
    )

@router.get("/{meeting_id}", response_model=schemas.MeetingDetailResponse)
def get_meeting_detail(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcripts = db.query(models.Transcript).filter(models.Transcript.meeting_id == meeting_id).order_by(models.Transcript.sequence).all()

    db_summary = db.query(models.Summary).filter(models.Summary.meeting_id == meeting_id).first()
    summary = None
    if db_summary:
        summary = schemas.SummaryResponse(
            id=db_summary.id,
            meeting_id=db_summary.meeting_id,
            overview=db_summary.overview,
            key_topics=json.loads(db_summary.key_topics),
            outline=json.loads(db_summary.outline)
        )

    action_items = db.query(models.ActionItem).filter(models.ActionItem.meeting_id == meeting_id).all()

    return schemas.MeetingDetailResponse(
        id=meeting.id,
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration,
        participants=json.loads(meeting.participants),
        audio_url=meeting.audio_url,
        created_at=meeting.created_at,
        updated_at=meeting.updated_at,
        transcript=[schemas.TranscriptLineResponse.model_validate(t) for t in transcripts],
        summary=summary,
        action_items=[schemas.ActionItemResponse.model_validate(a) for a in action_items]
    )

@router.post("/{meeting_id}/summarize", response_model=schemas.MeetingDetailResponse)
def summarize_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcripts = db.query(models.Transcript).filter(models.Transcript.meeting_id == meeting_id).order_by(models.Transcript.sequence).all()
    if not transcripts:
        raise HTTPException(status_code=400, detail="Cannot generate AI summary without transcript dialogues. Please upload a transcript file first.")

    participants = json.loads(meeting.participants)
    summary_data = generate_ai_summary(meeting.title, participants, transcripts)

    # Upsert Summary
    db_summary = db.query(models.Summary).filter(models.Summary.meeting_id == meeting_id).first()
    if db_summary:
        db_summary.overview = summary_data["overview"]
        db_summary.key_topics = json.dumps(summary_data["key_topics"])
        db_summary.outline = json.dumps(summary_data["outline"])
    else:
        db_summary = models.Summary(
            meeting_id=meeting_id,
            overview=summary_data["overview"],
            key_topics=json.dumps(summary_data["key_topics"]),
            outline=json.dumps(summary_data["outline"])
        )
        db.add(db_summary)

    # Add detected action items if not present
    for ai in summary_data["action_items"]:
        existing = db.query(models.ActionItem).filter(
            models.ActionItem.meeting_id == meeting_id,
            models.ActionItem.text == ai["text"]
        ).first()
        if not existing:
            db_action = models.ActionItem(
                meeting_id=meeting_id,
                text=ai["text"],
                assignee=ai["assignee"],
                due_date=ai["due_date"],
                completed=False
            )
            db.add(db_action)

    db.commit()
    return get_meeting_detail(meeting_id=meeting_id, db=db)

@router.put("/{meeting_id}", response_model=schemas.MeetingListItemResponse)
def update_meeting(meeting_id: int, meeting_update: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    if meeting_update.title is not None:
        meeting.title = meeting_update.title
    if meeting_update.participants is not None:
        meeting.participants = json.dumps(meeting_update.participants)
    if meeting_update.audio_url is not None:
        meeting.audio_url = meeting_update.audio_url
    if meeting_update.duration is not None:
        meeting.duration = meeting_update.duration
    if meeting_update.date is not None:
        meeting.date = meeting_update.date

    meeting.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(meeting)

    transcript_count = db.query(models.Transcript).filter(models.Transcript.meeting_id == meeting.id).count()
    has_summary = db.query(models.Summary).filter(models.Summary.meeting_id == meeting.id).first() is not None

    return schemas.MeetingListItemResponse(
        id=meeting.id,
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration,
        participants=json.loads(meeting.participants),
        transcript_count=transcript_count,
        has_summary=has_summary,
        created_at=meeting.created_at
    )

@router.delete("/{meeting_id}")
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    db.delete(meeting)
    db.commit()
    return {"deleted": True}
