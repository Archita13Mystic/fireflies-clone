import json
from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if database is already seeded
    if db.query(models.Meeting).first():
        print("Database already contains data. Skipping seed.")
        db.close()
        return

    print("Seeding database with sample meetings...")

    now = datetime.utcnow()

    # Sample 1: Product Strategy
    m1 = models.Meeting(
        title="Q3 Product Strategy & Roadmap Alignment",
        date=now - timedelta(days=1, hours=3),
        duration_seconds=1420, # ~23 mins
        organizer="Archita Sharma",
        participants=json.dumps(["Archita Sharma", "Alex Rivera", "Devin Chen", "Sarah Jenkins"]),
        category="Product",
        audio_url="/samples/sample-meeting.mp3"
    )
    db.add(m1)
    db.commit()
    db.refresh(m1)

    m1_transcripts = [
        models.Transcript(meeting_id=m1.id, speaker_name="Archita Sharma", speaker_avatar="#6366F1", start_time=0.0, end_time=12.0, text="Welcome everyone to our Q3 Product Strategy sync! Today we need to align on core milestones and AI features."),
        models.Transcript(meeting_id=m1.id, speaker_name="Alex Rivera", speaker_avatar="#8B5CF6", start_time=14.0, end_time=32.0, text="Thanks Archita. On the product side, user feedback shows high demand for interactive transcripts and instant AI action item extraction."),
        models.Transcript(meeting_id=m1.id, speaker_name="Devin Chen", speaker_avatar="#EC4899", start_time=35.0, end_time=58.0, text="From engineering, we have prepared our SQLite database schema and FastAPI endpoints. We can process transcript chunks efficiently."),
        models.Transcript(meeting_id=m1.id, speaker_name="Sarah Jenkins", speaker_avatar="#10B981", start_time=62.0, end_time=88.0, text="That sounds great. Design has completed the dark theme UI mockups. We want to ensure seamless audio waveform sync with text lines."),
        models.Transcript(meeting_id=m1.id, speaker_name="Archita Sharma", speaker_avatar="#6366F1", start_time=92.0, end_time=120.0, text="Excellent! Let's prioritize the meeting library dashboard, transcript detail view, and Ask Fred AI assistant chat for our first release."),
        models.Transcript(meeting_id=m1.id, speaker_name="Devin Chen", speaker_avatar="#EC4899", start_time=125.0, end_time=150.0, text="I will take responsibility for setting up CORS, Pydantic schemas, and preparing Render deployment configurations."),
        models.Transcript(meeting_id=m1.id, speaker_name="Alex Rivera", speaker_avatar="#8B5CF6", start_time=155.0, end_time=180.0, text="I will write unit tests for transcript search and action item state transitions.")
    ]
    for t in m1_transcripts:
        db.add(t)

    s1 = models.Summary(
        meeting_id=m1.id,
        overview="The team aligned on Q3 product priorities, emphasizing interactive meeting transcripts, automated AI summary generation, Ask Fred QA chat, and Render cloud deployment.",
        key_takeaways=json.dumps([
            "Prioritized Fireflies dark theme design and audio player transcript synchronization.",
            "Engineered fast FastAPI backend with SQLite persistence and CORS setup.",
            "Confirmed target deployment platform as Render with environment variable integration."
        ]),
        chapters=json.dumps([
            {"start_time": 0.0, "title": "Welcome & Q3 Goals", "summary": "Archita introduced the meeting agenda and product scope."},
            {"start_time": 35.0, "title": "Backend Architecture", "summary": "Devin presented FastAPI & SQLite schema for real-time transcript queries."},
            {"start_time": 92.0, "title": "Action Plan & Next Steps", "summary": "Assigned ownership for frontend components, backend tests, and Render deployment."}
        ])
    )
    db.add(s1)

    a1 = [
        models.ActionItem(meeting_id=m1.id, text="Setup FastAPI CORS and Render deployment configuration", assignee="Devin Chen", status="pending", due_date="Aug 15"),
        models.ActionItem(meeting_id=m1.id, text="Build Next.js interactive audio transcript player component", assignee="Archita Sharma", status="completed", due_date="Aug 14"),
        models.ActionItem(meeting_id=m1.id, text="Write API test suite for transcript search and export router", assignee="Alex Rivera", status="pending", due_date="Aug 16")
    ]
    for a in a1:
        db.add(a)

    sb1 = models.Soundbite(meeting_id=m1.id, title="Product Priorities Alignment", start_time=92.0, end_time=120.0, text="Let's prioritize the meeting library dashboard, transcript detail view, and Ask Fred AI assistant chat.", category="highlight")
    db.add(sb1)

    c1 = [
        models.ChatMessage(meeting_id=m1.id, sender="user", content="What are the key technical deliverables assigned to Devin?"),
        models.ChatMessage(meeting_id=m1.id, sender="fred", content="Devin Chen is assigned to set up CORS, SQLite database schemas, Pydantic validation, and Render deployment scripts.")
    ]
    for c in c1:
        db.add(c)


    # Sample 2: Engineering Architecture
    m2 = models.Meeting(
        title="Engineering Architecture & Microservices Migration",
        date=now - timedelta(days=3, hours=5),
        duration_seconds=2100, # 35 mins
        organizer="Archita Sharma",
        participants=json.dumps(["Archita Sharma", "Marcus Vance", "Devin Chen"]),
        category="Engineering",
        audio_url="/samples/sample-meeting.mp3"
    )
    db.add(m2)
    db.commit()
    db.refresh(m2)

    m2_transcripts = [
        models.Transcript(meeting_id=m2.id, speaker_name="Marcus Vance", speaker_avatar="#F59E0B", start_time=0.0, end_time=25.0, text="Hey team, today we are reviewing our REST API endpoints and data indexing strategy for search."),
        models.Transcript(meeting_id=m2.id, speaker_name="Archita Sharma", speaker_avatar="#6366F1", start_time=28.0, end_time=50.0, text="Our SQLite database handles relationships cleanly with SQLAlchemy 2.0 ORM. We also need full-text search capability on transcript lines."),
        models.Transcript(meeting_id=m2.id, speaker_name="Devin Chen", speaker_avatar="#EC4899", start_time=54.0, end_time=82.0, text="I tested ILIKE pattern matching in SQLite and response time is under 15 milliseconds for full transcript sets."),
        models.Transcript(meeting_id=m2.id, speaker_name="Marcus Vance", speaker_avatar="#F59E0B", start_time=85.0, end_time=115.0, text="That performance is excellent for our needs. Let's make sure error handlers return structured JSON messages.")
    ]
    for t in m2_transcripts:
        db.add(t)

    s2 = models.Summary(
        meeting_id=m2.id,
        overview="Engineering team reviewed API response times, database indexing, and error handling for transcript search.",
        key_takeaways=json.dumps([
            "Verified SQLite query response time is under 15ms for search queries.",
            "Standardized FastAPI exception handlers across all router endpoints.",
            "Ensured backward compatibility for JSON, TXT, and Markdown exports."
        ]),
        chapters=json.dumps([
            {"start_time": 0.0, "title": "API Review", "summary": "Marcus initiated review of search latency and database response."},
            {"start_time": 54.0, "title": "Performance Benchmarks", "summary": "Devin shared SQLite performance metrics."}
        ])
    )
    db.add(s2)

    a2 = [
        models.ActionItem(meeting_id=m2.id, text="Standardize error response JSON format across FastAPI routers", assignee="Marcus Vance", status="completed", due_date="Aug 12"),
        models.ActionItem(meeting_id=m2.id, text="Add full-text search index on transcript body", assignee="Devin Chen", status="pending", due_date="Aug 15")
    ]
    for a in a2:
        db.add(a)


    # Sample 3: Customer Success
    m3 = models.Meeting(
        title="Customer Success Onboarding & Pain Points Review",
        date=now - timedelta(days=5, hours=1),
        duration_seconds=1800, # 30 mins
        organizer="Archita Sharma",
        participants=json.dumps(["Archita Sharma", "Elena Rostova", "David Kim"]),
        category="Customer",
        audio_url="/samples/sample-meeting.mp3"
    )
    db.add(m3)
    db.commit()
    db.refresh(m3)

    m3_transcripts = [
        models.Transcript(meeting_id=m3.id, speaker_name="Elena Rostova", speaker_avatar="#3B82F6", start_time=0.0, end_time=20.0, text="Customer feedback highlights the need for fast meeting search by participant names and export to Markdown."),
        models.Transcript(meeting_id=m3.id, speaker_name="David Kim", speaker_avatar="#10B981", start_time=22.0, end_time=48.0, text="Users love the Ask Fred bot when reviewing meeting action items after long calls."),
        models.Transcript(meeting_id=m3.id, speaker_name="Archita Sharma", speaker_avatar="#6366F1", start_time=50.0, end_time=75.0, text="We will make sure the UI includes quick filter pills for category and date sorting.")
    ]
    for t in m3_transcripts:
        db.add(t)

    s3 = models.Summary(
        meeting_id=m3.id,
        overview="Customer success session highlighted positive feedback for Ask Fred AI chat and requests for quick filtering.",
        key_takeaways=json.dumps([
            "Users praise Ask Fred interactive transcript Q&A functionality.",
            "Requested quick category filter pills on the meetings home view.",
            "Validated high demand for Markdown and PDF meeting note downloads."
        ]),
        chapters=json.dumps([
            {"start_time": 0.0, "title": "Customer Feedback Overview", "summary": "Elena presented user feedback metrics."}
        ])
    )
    db.add(s3)

    a3 = [
        models.ActionItem(meeting_id=m3.id, text="Add category filter pills to Meetings Dashboard header", assignee="Archita Sharma", status="completed", due_date="Aug 11")
    ]
    for a in a3:
        db.add(a)

    db.commit()
    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
