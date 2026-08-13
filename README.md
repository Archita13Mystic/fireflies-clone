# Fireflies.ai Clone 🎙️

A modern, full-stack meeting assistant web application inspired by **Fireflies.ai**. The platform allows users to browse a library of meetings, interact with timestamp-synchronized transcripts and media controls, generate AI-powered summaries and action items, and ingest transcript files in multiple formats.

---

## ✨ Features

- **Interactive Meeting Workspace**:
  - Clickable transcripts with speaker avatars and timestamp seeking.
  - Timeline scrubber synced with transcript dialogues.
  - In-transcript search with instant match highlighting.
- **AI Summary & Insights Engine**:
  - **Executive Overview**: High-level synthesis of discussion points and consensus.
  - **Key Topics**: Categorized tag chips (Architecture, Frontend, QA, Sprint Planning, etc.).
  - **Meeting Outline**: Timestamped chapter segments for fast navigation.
  - **Action Items**: Heuristic extraction of tasks with speaker assignment and due dates.
  - **On-Demand Generation**: "AI Summarize / Regenerate" button for live analysis.
- **Multi-Format Transcript Ingestion**:
  - Support for uploading `.json`, `.vtt` (WebVTT), and `.txt` transcript files.
  - Paste transcript text directly during meeting creation.
- **Meetings Library & Filters**:
  - Filter meetings by participant or date range.
  - Sort by recency or title.
  - Full CRUD capabilities (Create, Edit, Delete with cascade).
- **Responsive Pastel UI**:
  - Collapsible desktop sidebar (240px expanded vs 64px compact icon bar).
  - Animated mobile drawer overlay.
  - Designed with Fireflies.ai light pastel aesthetic.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios & React Hot Toast

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database**: SQLAlchemy with SQLite
- **Validation**: Pydantic v2
- **Server**: Uvicorn

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Next.js 14 Frontend (App Router)           │
│  / (Dashboard)   /meetings   /meetings/[id]   /settings  │
└────────────────────────────┬────────────────────────────┘
                             │ Typed Axios HTTP API Calls
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 FastAPI REST Backend                    │
│  /api/meetings   /api/transcripts   /api/action-items    │
└────────────────────────────┬────────────────────────────┘
                             │ SQLAlchemy ORM
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   SQLite Database                       │
│       meetings  •  transcripts  •  summaries  •  tasks  │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### `meetings`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique meeting identifier |
| `title` | TEXT | NOT NULL | Title of the meeting |
| `date` | DATETIME | NOT NULL | Scheduled meeting timestamp |
| `duration` | INTEGER | NOT NULL | Meeting duration in seconds |
| `participants` | TEXT | NOT NULL | JSON array of participant names |
| `audio_url` | TEXT | NULLABLE | Audio/media placeholder URL |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### `transcripts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique transcript line ID |
| `meeting_id` | INTEGER | FK → meetings.id | Cascade delete |
| `speaker` | TEXT | NOT NULL | Name of the speaker |
| `text` | TEXT | NOT NULL | Dialogue content |
| `start_time` | REAL | NOT NULL | Start offset in seconds |
| `end_time` | REAL | NOT NULL | End offset in seconds |
| `sequence` | INTEGER | NOT NULL | 1-based line order |

### `summaries`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique summary ID |
| `meeting_id` | INTEGER | FK → meetings.id, UNIQUE | Cascade delete |
| `overview` | TEXT | NOT NULL | Executive overview paragraph |
| `key_topics` | TEXT | NOT NULL | JSON array of topic strings |
| `outline` | TEXT | NOT NULL | JSON array of `{title, start_time}` |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Summary creation timestamp |

### `action_items`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique action item ID |
| `meeting_id` | INTEGER | FK → meetings.id | Cascade delete |
| `text` | TEXT | NOT NULL | Description of the action task |
| `assignee` | TEXT | NULLABLE | Assigned team member |
| `due_date` | TEXT | NULLABLE | Target completion date (`YYYY-MM-DD`) |
| `completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |

---

## 🔌 API Endpoints

### Meetings
- `GET /api/meetings` — List all meetings (supports `?search=`, `?sort=date_desc|date_asc|title_asc`, `?participant=`).
- `POST /api/meetings` — Create a meeting with optional pasted transcript.
- `GET /api/meetings/{id}` — Retrieve meeting details, transcript, summary, and action items.
- `PUT /api/meetings/{id}` — Update meeting metadata.
- `DELETE /api/meetings/{id}` — Delete meeting and cascade all associations.
- `POST /api/meetings/{id}/summarize` — Generate/regenerate AI summary, outline, and action items from transcripts.

### Transcripts
- `GET /api/meetings/{id}/transcript` — Retrieve ordered transcript lines.
- `POST /api/meetings/{id}/transcript/upload` — Ingest `.vtt`, `.txt`, or `.json` transcript files.

### Action Items
- `POST /api/meetings/{id}/action-items` — Create a new action item.
- `PUT /api/action-items/{id}` — Update task text, assignee, due date, or toggle completion.
- `DELETE /api/action-items/{id}` — Delete an action item.

---

## 💻 Local Development Setup

### 1. Backend (FastAPI)

```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
# Windows: venv\Scripts\activate
# Unix/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (auto-seeds 5 sample meetings on first launch)
python run.py
```
Backend will be live at **http://localhost:8000** (Swagger documentation: **http://localhost:8000/docs**).

---

### 2. Frontend (Next.js 14)

```bash
cd frontend

# Copy environment template
cp .env.example .env.local

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Frontend will be live at **http://localhost:3000**.

---

## ☁️ Deployment on Render

This repository includes a [`render.yaml`](./render.yaml) Blueprint for automated zero-config deployment:

1. Push this repository to your GitHub account.
2. Log in to [dashboard.render.com](https://dashboard.render.com/) → **New +** → **Blueprint**.
3. Select this repository and click **Apply**.
4. Render will deploy:
   - **`fireflies-backend`**: Python web service with a persistent SQLite disk mounted at `/data`.
   - **`fireflies-frontend`**: Next.js Node web service connected to the backend API.
