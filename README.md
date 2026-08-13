# Fireflies.ai Clone

A full-stack clone of [Fireflies.ai](https://fireflies.ai), a meeting assistant web application. This project replicates the core post-meeting workflows: interactive transcripts, AI summaries, action items, and global search.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy ORM |
| **Database** | SQLite (persisted via Render disk mount) |
| **Frontend Packages** | axios, lucide-react, date-fns, react-hot-toast |
| **Backend Packages** | uvicorn, pydantic, python-multipart |
| **Deployment** | Render.com (two separate web services) |

---

## Architecture Overview

```
┌─────────────────────────────┐    HTTPS     ┌─────────────────────────────┐
│   Next.js Frontend          │ ─────────── ▶ │   FastAPI Backend            │
│   (fireflies-frontend)      │              │   (fireflies-backend)        │
│                             │◀──────────── │                              │
│  Pages: /meetings, /search, │   JSON API   │  Routers: meetings,          │
│  /topics, /integrations,    │              │  transcripts, action_items,  │
│  /settings                  │              │  search                      │
└─────────────────────────────┘              └──────────────┬───────────────┘
                                                            │
                                                   ┌────────▼────────┐
                                                   │   SQLite DB     │
                                                   │  /data/fireflies│
                                                   │  .db            │
                                                   └─────────────────┘
```

**Flow:**
1. Frontend makes typed Axios calls (all in `lib/api.ts`) to the FastAPI backend
2. FastAPI validates requests via Pydantic, queries SQLite via SQLAlchemy ORM
3. On first startup, if the meetings table is empty, the backend auto-seeds 5 realistic meetings with transcripts, summaries, and action items
4. SQLite database is persisted on a 1GB Render disk volume (`/data/fireflies.db`) between deployments

---

## Database Schema

### `meetings`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| title | TEXT | NOT NULL |
| date | DATETIME | NOT NULL |
| duration | INTEGER | NOT NULL (seconds) |
| participants | TEXT | NOT NULL (JSON array of name strings) |
| audio_url | TEXT | NULLABLE |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### `transcripts`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| meeting_id | INTEGER | FK → meetings.id CASCADE DELETE |
| speaker | TEXT | NOT NULL |
| text | TEXT | NOT NULL |
| start_time | REAL | NOT NULL (seconds from start) |
| end_time | REAL | NOT NULL |
| sequence | INTEGER | NOT NULL (1-based ordering) |

### `summaries`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| meeting_id | INTEGER | FK → meetings.id CASCADE DELETE, UNIQUE |
| overview | TEXT | NOT NULL |
| key_topics | TEXT | NOT NULL (JSON array of strings) |
| outline | TEXT | NOT NULL (JSON array of {title, start_time}) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### `action_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| meeting_id | INTEGER | FK → meetings.id CASCADE DELETE |
| text | TEXT | NOT NULL |
| assignee | TEXT | NULLABLE |
| due_date | TEXT | NULLABLE (YYYY-MM-DD) |
| completed | BOOLEAN | DEFAULT FALSE |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Relationships:**
- `meetings` 1→N `transcripts` (cascade delete)
- `meetings` 1→1 `summaries` (cascade delete)
- `meetings` 1→N `action_items` (cascade delete)

---

## API Overview

### Meetings

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/meetings` | List all meetings. Supports `?search=`, `?sort=date_desc\|date_asc\|title_asc`, `?participant=` |
| `POST` | `/api/meetings` | Create a new meeting. Body: `{title, date, duration (min), participants, audio_url?, transcript_text?}` |
| `GET` | `/api/meetings/{id}` | Get meeting detail with nested transcript, summary, action_items |
| `PUT` | `/api/meetings/{id}` | Update meeting fields (title, date, duration, participants, audio_url) |
| `DELETE` | `/api/meetings/{id}` | Delete meeting and cascade to all related data |

### Transcripts

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/meetings/{id}/transcript` | Get ordered transcript lines for a meeting |
| `POST` | `/api/meetings/{id}/transcript/upload` | Upload `.txt` or `.vtt` file to replace existing transcript |

### Action Items

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/meetings/{id}/action-items` | Create a new action item. Body: `{text, assignee?, due_date?}` |
| `PUT` | `/api/action-items/{id}` | Update action item fields (text, assignee, due_date, completed) |
| `DELETE` | `/api/action-items/{id}` | Delete a single action item |

### Search

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/search?q=keyword` | Case-insensitive search across meeting titles and transcript text. Returns meetings with up to 3 matching snippets each |

---

## Local Setup

### Backend

**Requirements:** Python 3.11+

```bash
cd backend

# (Optional) create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will:
1. Create all database tables on startup
2. Auto-seed 5 realistic meetings if the database is empty
3. Serve API docs at http://localhost:8000/docs

### Frontend

**Requirements:** Node.js 20+

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at **http://localhost:3000**

---

## Deployment (Render.com)

1. **Push to GitHub** — make sure the repository is public
2. Go to [render.com](https://render.com) → **New** → **Blueprint** → connect your GitHub repository
3. Render will automatically read `render.yaml` and create two services:
   - `fireflies-backend` (Python web service with persistent SQLite disk)
   - `fireflies-frontend` (Node.js web service)
4. After the backend deploys, **copy its URL** (e.g. `https://fireflies-backend-xxxx.onrender.com`)
5. In Render Dashboard → `fireflies-frontend` service → **Environment** → set:
   ```
   NEXT_PUBLIC_API_URL = https://fireflies-backend-xxxx.onrender.com
   ```
6. Trigger a **manual redeploy** of the frontend service
7. Both services are now live ✅

---

## Assumptions Made

1. **Authentication is hardcoded** — The user is always "John Doe" with no login flow, as specified in scope boundaries
2. **Audio playback** — Uses `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3` as placeholder audio for all seeded meetings, since real audio transcription is out of scope
3. **Duration input** — The `POST /api/meetings` endpoint accepts duration in **minutes** (user-facing input) and converts to seconds for storage; `GET` responses return duration in seconds
4. **Transcript parsing** — Pasted transcript supports `Speaker Name (MM:SS): text` and `Speaker Name: text` formats; unknown lines default to "Speaker 1" with 30-second auto-incremented timestamps
5. **Summary not auto-generated** — Summaries are seeded for the 5 default meetings; newly created meetings have no summary (null) unless seeded or added via database directly
6. **CORS** — Set to `allow_origins=["*"]` for development convenience; this should be restricted to specific frontend URLs in a production hardened environment
7. **SQLite** — Used for simplicity and Render compatibility with persistent disk. For multi-instance production, PostgreSQL would be preferred
