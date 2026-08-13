import re
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/meetings", tags=["transcripts"])

def parse_txt_content(content: str) -> List[dict]:
    lines = content.strip().split("\n")
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

def parse_time_to_seconds(time_str: str) -> float:
    parts = time_str.strip().split(":")
    if len(parts) == 3:
        hours = int(parts[0])
        minutes = int(parts[1])
        seconds = float(parts[2])
        return hours * 3600 + minutes * 60 + seconds
    elif len(parts) == 2:
        minutes = int(parts[0])
        seconds = float(parts[1])
        return minutes * 60 + seconds
    return 0.0

def parse_vtt_content(content: str) -> List[dict]:
    content = content.replace("\r\n", "\n")
    blocks = content.split("\n\n")
    parsed_lines = []
    sequence = 1
    speaker_alt = 1

    for block in blocks:
        block = block.strip()
        if not block or block.startswith("WEBVTT"):
            continue

        lines = block.split("\n")
        if len(lines) >= 2 and not ("-->" in lines[0]) and ("-->" in lines[1]):
            lines = lines[1:]

        if len(lines) < 2:
            continue

        time_line = lines[0]
        text_lines = lines[1:]

        if "-->" not in time_line:
            continue

        times = time_line.split("-->")
        start_time = parse_time_to_seconds(times[0])
        end_time = parse_time_to_seconds(times[1])

        full_text = " ".join(text_lines).strip()

        match_sp = re.match(r"^([^:]+?)\s*:\s*(.*)$", full_text)
        if match_sp:
            speaker = match_sp.group(1).strip()
            text = match_sp.group(2).strip()
        else:
            speaker = f"Speaker {speaker_alt}"
            text = full_text
            speaker_alt = 2 if speaker_alt == 1 else 1

        parsed_lines.append({
            "speaker": speaker,
            "text": text,
            "start_time": start_time,
            "end_time": end_time,
            "sequence": sequence
        })
        sequence += 1

    return parsed_lines

def parse_json_content(content: str) -> List[dict]:
    try:
        data = json.loads(content)
    except Exception:
        raise ValueError("Invalid JSON format")

    if isinstance(data, dict):
        if "transcript" in data and isinstance(data["transcript"], list):
            data = data["transcript"]
        elif "transcripts" in data and isinstance(data["transcripts"], list):
            data = data["transcripts"]
        elif "lines" in data and isinstance(data["lines"], list):
            data = data["lines"]
        elif "dialogues" in data and isinstance(data["dialogues"], list):
            data = data["dialogues"]
        else:
            raise ValueError("JSON transcript object must contain a list (keys: transcript, transcripts, lines, or dialogues)")

    if not isinstance(data, list):
        raise ValueError("JSON transcript must be a list of objects")

    parsed_lines = []
    current_time = 0.0
    sequence = 1

    for idx, item in enumerate(data):
        if not isinstance(item, dict):
            continue
        speaker = item.get("speaker") or item.get("speaker_name") or f"Speaker {1 if idx % 2 == 0 else 2}"
        text = item.get("text") or item.get("dialogue") or item.get("content") or ""

        start_time = item.get("start_time")
        if start_time is None:
            start_time = current_time
            end_time = start_time + 30.0
        else:
            start_time = float(start_time)
            end_time = item.get("end_time")
            if end_time is None:
                end_time = start_time + 15.0
            else:
                end_time = float(end_time)

        current_time = end_time
        seq = item.get("sequence") or sequence

        parsed_lines.append({
            "speaker": str(speaker),
            "text": str(text),
            "start_time": start_time,
            "end_time": end_time,
            "sequence": int(seq)
        })
        sequence += 1

    return parsed_lines

@router.get("/{meeting_id}/transcript", response_model=List[schemas.TranscriptLineResponse])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcripts = db.query(models.Transcript).filter(models.Transcript.meeting_id == meeting_id).order_by(models.Transcript.sequence).all()
    return transcripts

@router.post("/{meeting_id}/transcript/upload")
async def upload_transcript(meeting_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    content = await file.read()
    decoded_content = content.decode("utf-8", errors="ignore")

    filename = file.filename.lower()
    try:
        if filename.endswith(".vtt"):
            parsed_lines = parse_vtt_content(decoded_content)
        elif filename.endswith(".txt"):
            parsed_lines = parse_txt_content(decoded_content)
        elif filename.endswith(".json"):
            parsed_lines = parse_json_content(decoded_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Only .txt, .vtt, and .json are allowed.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not parsed_lines:
        raise HTTPException(status_code=400, detail="No transcript items parsed from the file.")

    # Remove existing transcripts
    db.query(models.Transcript).filter(models.Transcript.meeting_id == meeting_id).delete()

    for line in parsed_lines:
        db_line = models.Transcript(
            meeting_id=meeting_id,
            speaker=line["speaker"],
            text=line["text"],
            start_time=line["start_time"],
            end_time=line["end_time"],
            sequence=line["sequence"]
        )
        db.add(db_line)

    db.commit()
    return {"inserted": len(parsed_lines)}
