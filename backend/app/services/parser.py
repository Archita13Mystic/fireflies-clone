import re
import json
from typing import List, Dict, Any

def parse_time_str(time_str: str) -> float:
    """Converts HH:MM:SS or MM:SS timestamp string to float seconds."""
    time_str = time_str.strip()
    parts = time_str.split(":")
    try:
        if len(parts) == 3:
            return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
        elif len(parts) == 2:
            return float(parts[0]) * 60 + float(parts[1])
        return float(time_str)
    except ValueError:
        return 0.0

def parse_transcript_text(raw_content: str, default_speakers: List[str] = None) -> List[Dict[str, Any]]:
    """
    Parses raw text, VTT, or JSON transcript into structured transcript segments.
    Each segment contains: speaker_name, start_time, end_time, text, speaker_avatar.
    """
    if not default_speakers:
        default_speakers = ["Archita Sharma", "Alex Rivera", "Devin Chen"]
    
    avatar_colors = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"]

    # Try parsing as JSON first
    try:
        data = json.loads(raw_content)
        if isinstance(data, list):
            parsed = []
            for i, item in enumerate(data):
                speaker = item.get("speaker_name") or item.get("speaker") or default_speakers[i % len(default_speakers)]
                start = float(item.get("start_time", i * 15))
                end = float(item.get("end_time", start + 12))
                text = item.get("text") or item.get("content", "")
                parsed.append({
                    "speaker_name": speaker,
                    "speaker_avatar": avatar_colors[hash(speaker) % len(avatar_colors)],
                    "start_time": start,
                    "end_time": end,
                    "text": text,
                    "sentiment": "neutral"
                })
            if parsed:
                return parsed
    except Exception:
        pass

    # Process line by line for text or VTT
    lines = raw_content.splitlines()
    parsed_segments = []
    current_speaker = default_speakers[0]
    current_time = 0.0
    
    # Regex patterns
    # Pattern 1: [01:23] Speaker: Text
    # Pattern 2: Speaker (01:23): Text
    # Pattern 3: 00:01:23.000 --> 00:01:28.000
    time_bracket_pattern = re.compile(r'\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.*?):\s*(.*)')
    speaker_time_pattern = re.compile(r'(.*?)\s*\((?:\[)?(\d{1,2}:\d{2}(?::\d{2})?)(?:\])?\):\s*(.*)')
    speaker_colon_pattern = re.compile(r'^([A-Z][a-zA-Z\s]{1,25}):\s*(.*)')
    vtt_time_pattern = re.compile(r'(\d{2}:\d{2}(?::\d{2})?(?:\.\d{3})?)\s*-->\s*(\d{2}:\d{2}(?::\d{2})?(?:\.\d{3})?)')

    vtt_pending_time = None

    for line in lines:
        line = line.strip()
        if not line or line == "WEBVTT" or line.isdigit():
            continue

        vtt_match = vtt_time_pattern.search(line)
        if vtt_match:
            start_s = parse_time_str(vtt_match.group(1).replace(',', '.'))
            end_s = parse_time_str(vtt_match.group(2).replace(',', '.'))
            vtt_pending_time = (start_s, end_s)
            continue

        match1 = time_bracket_pattern.match(line)
        if match1:
            t_str, speaker, text = match1.groups()
            current_time = parse_time_str(t_str)
            current_speaker = speaker.strip() if speaker else current_speaker
            parsed_segments.append({
                "speaker_name": current_speaker,
                "speaker_avatar": avatar_colors[hash(current_speaker) % len(avatar_colors)],
                "start_time": current_time,
                "end_time": current_time + 12.0,
                "text": text.strip(),
                "sentiment": "neutral"
            })
            continue

        match2 = speaker_time_pattern.match(line)
        if match2:
            speaker, t_str, text = match2.groups()
            current_time = parse_time_str(t_str)
            current_speaker = speaker.strip()
            parsed_segments.append({
                "speaker_name": current_speaker,
                "speaker_avatar": avatar_colors[hash(current_speaker) % len(avatar_colors)],
                "start_time": current_time,
                "end_time": current_time + 12.0,
                "text": text.strip(),
                "sentiment": "neutral"
            })
            continue

        match3 = speaker_colon_pattern.match(line)
        if match3:
            speaker, text = match3.groups()
            current_speaker = speaker.strip()
            start_t = vtt_pending_time[0] if vtt_pending_time else current_time
            end_t = vtt_pending_time[1] if vtt_pending_time else current_time + 12.0
            vtt_pending_time = None
            current_time = end_t
            parsed_segments.append({
                "speaker_name": current_speaker,
                "speaker_avatar": avatar_colors[hash(current_speaker) % len(avatar_colors)],
                "start_time": start_t,
                "end_time": end_t,
                "text": text.strip(),
                "sentiment": "neutral"
            })
            continue

        # Fallback raw sentence line
        if len(line) > 3:
            start_t = vtt_pending_time[0] if vtt_pending_time else current_time
            end_t = vtt_pending_time[1] if vtt_pending_time else current_time + 10.0
            vtt_pending_time = None
            current_time = end_t + 2.0
            parsed_segments.append({
                "speaker_name": current_speaker,
                "speaker_avatar": avatar_colors[hash(current_speaker) % len(avatar_colors)],
                "start_time": start_t,
                "end_time": end_t,
                "text": line,
                "sentiment": "neutral"
            })

    if not parsed_segments and raw_content.strip():
        # Fallback chunking if plain text block without formatting
        sentences = [s.strip() for s in re.split(r'(?<=[.!?]) +', raw_content) if s.strip()]
        t = 0.0
        for i, sentence in enumerate(sentences):
            spk = default_speakers[i % len(default_speakers)]
            parsed_segments.append({
                "speaker_name": spk,
                "speaker_avatar": avatar_colors[hash(spk) % len(avatar_colors)],
                "start_time": t,
                "end_time": t + 8.0,
                "text": sentence,
                "sentiment": "neutral"
            })
            t += 10.0

    return parsed_segments
