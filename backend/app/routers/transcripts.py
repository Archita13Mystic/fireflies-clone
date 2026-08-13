from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.services.parser import parse_transcript_text

router = APIRouter(prefix="/api/transcripts", tags=["transcripts"])

@router.get("/search", response_model=List[schemas.TranscriptOut])
def search_transcripts(
    q: str = Query(..., min_length=2, description="Search term across transcripts"),
    meeting_id: Optional[int] = Query(None, description="Optional meeting ID filter"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Transcript).filter(models.Transcript.text.ilike(f"%{q}%"))
    if meeting_id:
        query = query.filter(models.Transcript.meeting_id == meeting_id)
    return query.all()

@router.post("/upload")
async def upload_transcript_file(
    file: UploadFile = File(...),
    title: str = Form("Uploaded Meeting Transcript"),
    category: str = Form("Uploads"),
    db: Session = Depends(get_db)
):
    content = (await file.read()).decode("utf-8", errors="ignore")
    parsed_transcripts = parse_transcript_text(content)

    if not parsed_transcripts:
        raise HTTPException(status_code=400, detail="Could not parse valid transcript content from file")

    # Create meeting
    speakers = list(set([t["speaker_name"] for t in parsed_transcripts]))
    duration = int(max([t["end_time"] for t in parsed_transcripts])) if parsed_transcripts else 1800

    new_meeting = models.Meeting(
        title=title,
        date=models.datetime.utcnow(),
        duration_seconds=duration,
        organizer="Archita Sharma",
        participants=models.json.dumps(speakers),
        category=category,
        audio_url="/samples/sample-meeting.mp3"
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

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

    # Generate summary & action items
    from app.services.ai_service import generate_summary_data
    summary_data = generate_summary_data(parsed_transcripts, title)

    summary_obj = models.Summary(
        meeting_id=new_meeting.id,
        overview=summary_data["overview"],
        key_takeaways=models.json.dumps(summary_data["key_takeaways"]),
        chapters=models.json.dumps(summary_data["chapters"])
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
    return {"message": "Transcript uploaded successfully", "meeting_id": new_meeting.id}
