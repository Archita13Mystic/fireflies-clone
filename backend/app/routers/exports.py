import json
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter(prefix="/api/meetings/{meeting_id}/export", tags=["exports"])

@router.get("")
def export_meeting(
    meeting_id: int,
    format: str = Query("md", description="md, txt, or json"),
    db: Session = Depends(get_db)
):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participants = json.loads(meeting.participants) if meeting.participants else []
    summary_overview = meeting.summary.overview if meeting.summary else "No overview available."
    key_takeaways = json.loads(meeting.summary.key_takeaways) if meeting.summary and meeting.summary.key_takeaways else []
    action_items = [f"- [{a.status.upper()}] {a.text} (Assignee: {a.assignee})" for a in meeting.action_items]

    if format == "json":
        data = {
            "title": meeting.title,
            "date": meeting.date.isoformat(),
            "duration_seconds": meeting.duration_seconds,
            "organizer": meeting.organizer,
            "participants": participants,
            "summary_overview": summary_overview,
            "key_takeaways": key_takeaways,
            "action_items": [{"text": a.text, "assignee": a.assignee, "status": a.status} for a in meeting.action_items],
            "transcripts": [{"speaker": t.speaker_name, "start_time": t.start_time, "text": t.text} for t in sorted(meeting.transcripts, key=lambda x: x.start_time)]
        }
        return Response(
            content=json.dumps(data, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{meeting.title.replace(" ", "_")}_notes.json"'}
        )

    if format == "txt":
        lines = [
            f"MEETING TITLE: {meeting.title}",
            f"DATE: {meeting.date.strftime('%B %d, %Y %H:%M')}",
            f"ORGANIZER: {meeting.organizer}",
            f"PARTICIPANTS: {', '.join(participants)}",
            "\n" + "="*50 + "\n",
            "SUMMARY OVERVIEW:",
            summary_overview,
            "\nKEY TAKEAWAYS:",
            "\n".join([f"• {kt}" for kt in key_takeaways]),
            "\nACTION ITEMS:",
            "\n".join(action_items),
            "\n" + "="*50 + "\n",
            "TRANSCRIPT:\n"
        ]
        for t in sorted(meeting.transcripts, key=lambda x: x.start_time):
            m, s = divmod(int(t.start_time), 60)
            lines.append(f"[{m:02d}:{s:02d}] {t.speaker_name}: {t.text}")

        content = "\n".join(lines)
        return Response(
            content=content,
            media_type="text/plain",
            headers={"Content-Disposition": f'attachment; filename="{meeting.title.replace(" ", "_")}_notes.txt"'}
        )

    # Default Markdown
    lines = [
        f"# {meeting.title}",
        f"**Date:** {meeting.date.strftime('%B %d, %Y')}  ",
        f"**Organizer:** {meeting.organizer}  ",
        f"**Participants:** {', '.join(participants)}  ",
        "\n---\n",
        "## 📝 Overview Summary",
        summary_overview,
        "\n## 💡 Key Takeaways",
        "\n".join([f"- {kt}" for kt in key_takeaways]),
        "\n## ✅ Action Items",
        "\n".join(action_items),
        "\n---\n",
        "## 💬 Full Transcript\n"
    ]
    for t in sorted(meeting.transcripts, key=lambda x: x.start_time):
        m, s = divmod(int(t.start_time), 60)
        lines.append(f"- **`[{m:02d}:{s:02d}]` {t.speaker_name}**: {t.text}")

    content = "\n".join(lines)
    return Response(
        content=content,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{meeting.title.replace(" ", "_")}_notes.md"'}
    )
