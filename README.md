# Fireflies.ai Clone — Fullstack Web Application

A fullstack clone of the **Fireflies.ai** meeting-assistant web application. The platform features Fireflies's signature dark slate visual design, interactive transcripts with click-to-seek audio playback, AI-generated executive summaries and chapter outlines, interactive action item task tracking, contextual **Ask Fred AI** chat assistant, file upload transcript importer, and multi-format exports (Markdown, TXT, JSON).

---

## 🚀 Live Demo & Render Deployment

- **Frontend Application**: [https://fireflies-clone-frontend.onrender.com](https://fireflies-clone-frontend.onrender.com) *(Configure your Render deployment URL here)*
- **Backend API Docs**: [https://fireflies-clone-backend.onrender.com/docs](https://fireflies-clone-backend.onrender.com/docs)

---

## 🛠 Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router, React 18, TypeScript) |
| **Styling & UI** | Tailwind CSS, Fireflies Custom Dark Slate Palette, Lucide Icons |
| **Backend API** | Python 3.10+ with FastAPI, Uvicorn |
| **Database** | SQLite with SQLAlchemy 2.0 ORM & Pydantic v2 |
| **State & Sync** | HTML5 Web Audio API, React Hooks, REST APIs |
| **Deployment** | Render (Web Services & `render.yaml` IaC spec) |

---

## 📐 Architecture & System Blueprint

```
+-----------------------------------------------------------------------------------+
|                            NEXT.JS FRONTEND (Port 3000)                           |
|                                                                                   |
|  +-------------------------+  +------------------------------------------------+  |
|  |     Sidebar Navigation  |  |  Header: Global Search, Quick Upload, User Prof |  |
|  +-------------------------+  +------------------------------------------------+  |
|  |                                                                                |  |
|  | [Dashboard / Library]     [Meeting Detail View]                                |  |
|  | - Category Filter Pills    - Synchronized Audio Waveform Player                |  |
|  | - Recency Sorting          - Interactive Transcript (Click-to-Seek)             |  |
|  | - Stat Cards              - AI Executive Summary, Key Takeaways & Chapters     |  |
|  | - Upload Modal            - Interactive Action Items Checklist                 |  |
|  |                           - Ask Fred AI Chat Bot / Soundbites / Exports        |  |
|  +--------------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTP REST API
                                           v
+-----------------------------------------------------------------------------------+
|                            FASTAPI BACKEND (Port 8000)                            |
|                                                                                   |
|  - Routers: /api/meetings, /api/transcripts, /api/action-items, /api/chat, export |
|  - Transcript Importer (.vtt, .json, .txt parser)                                 |
|  - AI Synthesizer (Summary, action items, chapters generator)                     |
|  - Ask Fred QA Engine (Contextual transcript answer generator)                    |
+------------------------------------------+----------------------------------------+
                                           | SQLAlchemy ORM
                                           v
+-----------------------------------------------------------------------------------+
|                                  SQLITE DATABASE                                  |
|                                                                                   |
|  Tables: meetings, transcripts, summaries, action_items, soundbites, chat_messages|
+-----------------------------------------------------------------------------------+
```

---

## 🗄 Database Schema Design

The SQLite database is structured with relational integrity using SQLAlchemy ORM:

### 1. `meetings` Table
- `id` (INTEGER, Primary Key)
- `title` (VARCHAR 255)
- `date` (DATETIME)
- `duration_seconds` (INTEGER)
- `organizer` (VARCHAR 255)
- `participants` (TEXT JSON String)
- `category` (VARCHAR 100) — *Product, Engineering, Customer, Executive, Design*
- `audio_url` (VARCHAR 500)
- `created_at`, `updated_at` (DATETIME)

### 2. `transcripts` Table
- `id` (INTEGER, Primary Key)
- `meeting_id` (INTEGER, Foreign Key -> `meetings.id`)
- `speaker_name` (VARCHAR 255)
- `speaker_avatar` (VARCHAR 100) — *Hex color avatar code*
- `start_time` (FLOAT) — *Timestamp in seconds*
- `end_time` (FLOAT)
- `text` (TEXT)
- `sentiment` (VARCHAR 50)

### 3. `summaries` Table
- `id` (INTEGER, Primary Key)
- `meeting_id` (INTEGER, Foreign Key -> `meetings.id`, Unique)
- `overview` (TEXT) — *Executive overview paragraph*
- `key_takeaways` (TEXT JSON Array)
- `chapters` (TEXT JSON Array of `{start_time, title, summary}`)

### 4. `action_items` Table
- `id` (INTEGER, Primary Key)
- `meeting_id` (INTEGER, Foreign Key -> `meetings.id`)
- `text` (TEXT)
- `assignee` (VARCHAR 255)
- `status` (VARCHAR 50) — *'pending' or 'completed'*
- `due_date` (VARCHAR 100)

### 5. `soundbites` Table
- `id` (INTEGER, Primary Key)
- `meeting_id` (INTEGER, Foreign Key -> `meetings.id`)
- `title`, `text`, `category` (VARCHAR/TEXT)
- `start_time`, `end_time` (FLOAT)

### 6. `chat_messages` Table
- `id` (INTEGER, Primary Key)
- `meeting_id` (INTEGER, Foreign Key -> `meetings.id`)
- `sender` (VARCHAR 50) — *'user' or 'fred'*
- `content` (TEXT)

---

## ⚡ Local Development Setup Guide

### Step 1: Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

### Step 2: Running Backend (FastAPI + SQLite)
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment (optional)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the database seeder and start server
python run.py
```
The FastAPI server will start at `http://127.0.0.1:8000`. Swagger API docs will be available at `http://127.0.0.1:8000/docs`.

### Step 3: Running Frontend (Next.js)
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start local development server
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🌐 Deploying to Render (Step-by-Step)

You can easily deploy both the backend and frontend services to [Render](https://render.com).

### Option A: Automatic Blueprint Deployment (`render.yaml`)
1. Push your repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository containing `render.yaml`.
5. Render will automatically detect the backend and frontend web services, install dependencies, and build both apps!

### Option B: Manual Web Service Setup on Render

#### 1. Backend Web Service
- **Name**: `fireflies-clone-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend`
- **Environment Variables**:
  - `PYTHON_VERSION` = `3.10.0`
  - `DATABASE_URL` = `sqlite:///./fireflies.db`

#### 2. Frontend Web Service
- **Name**: `fireflies-clone-frontend`
- **Environment**: `Node`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Start Command**: `cd frontend && npm start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` = `https://fireflies-clone-backend.onrender.com` *(Replace with your deployed backend Render URL)*

---

## 🔌 Main API Routes Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/meetings` | List meetings (search, category filter, sorting) |
| `GET` | `/api/meetings/stats` | Dashboard statistics |
| `GET` | `/api/meetings/{id}` | Get full meeting detail with transcripts, summary, and action items |
| `POST` | `/api/meetings` | Create meeting from form or transcript text |
| `DELETE` | `/api/meetings/{id}` | Delete meeting |
| `POST` | `/api/meetings/{id}/action-items` | Add new action item |
| `PATCH` | `/api/meetings/{id}/action-items/{item_id}` | Toggle status or update action item |
| `POST` | `/api/meetings/{id}/chat` | Ask Fred AI assistant Q&A endpoint |
| `POST` | `/api/transcripts/upload` | Upload `.vtt`, `.json`, or `.txt` transcript file |
| `GET` | `/api/meetings/{id}/export?format=md` | Export meeting notes as Markdown, TXT, or JSON |
