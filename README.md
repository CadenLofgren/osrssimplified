# OSRSSimplified

**OSRSSimplified** is a web app that summarizes **Old School RuneScape (OSRS)** skill training methods.  
It provides easy-to-read, Markdown-formatted guides for each skill — split into **F2P** and **P2P** sections — with a clean, dark aesthetic inspired by the game’s interface.

---

## Tech Stack

**Frontend:** Next.js 14+ (TypeScript)  
**Backend:** FastAPI + PostgreSQL  
**Animations:** Framer Motion  
**Styling:** Tailwind CSS  
**Markdown Rendering:** React Markdown  
**Testing:** Jest + React Testing Library (frontend), Pytest (backend)

---

## Features

- Displays all OSRS skills in an alphabetical grid with icons  
- Detailed skill pages with F2P/P2P tabs  
- Markdown-based summaries (supports headers, lists, etc.)  
- Subtle video background on the homepage *(credit: [Melankola on YouTube](https://www.youtube.com/watch?v=D7EGZDfTWO0))*  
- Responsive layout with seasonal backgrounds  
- FastAPI backend with automated wiki data fetcher  
- Modular and testable design  

---

## Project Structure

```
OSRSSimplified/
├── backend/
│   ├── app.py
│   ├── skill_fetcher.py
│   ├── summarize_skills.py
│   └── models.py
│   └── tests/
│       └── test_app.py
│       └── test_skill_fetcher.py
│       └── test_summarize_skills.py
│       
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── skills/
│   │   │   ├── page.tsx
│   │   │   └── [skill]/page.tsx
│   ├── components/
│   │   └── Nabar.tsx
│   └── utils/
│       └── getSeasonalBackground.ts
│
├── __tests__/
│   ├── About.test.tsx
│   ├── Home.test.tsx
│   ├── SkillDetailsClient.test.tsx
│   └── SkillsPage.test.tsx
└── README.md
```

---

## Setup & Installation

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:  
**http://127.0.0.1:8000**

---

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:  
**http://localhost:3000**

---

## Connecting Frontend to Backend

By default, the frontend fetches data from:
```ts
fetch("http://127.0.0.1:8000/skills");
```

For production, create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=https://api.osrssimplified.com
```

---

## Running Tests

**Frontend Tests**
```bash
npm run test
```

**Backend Tests**
```bash
pytest
```

**Integration Tests**
```bash
npm run test:integration
```

---

## API Documentation

Base URL (local):  
`http://127.0.0.1:8000`

All responses are returned in **JSON**.

---

### **GET /skills**
Returns all available OSRS skills.

**Example Response**
```json
[
  { "id": 1, "name": "Attack" },
  { "id": 2, "name": "Defence" },
  { "id": 3, "name": "Strength" }
]
```

---

### **GET /skills/{skill_name}**
Returns a detailed Markdown-formatted summary for a given skill.

**Example Response**
```json
{
  "id": 1,
  "name": "Attack",
  "category": "Combat",
  "summary": "### Attack Training (F2P)\n1. Train on cows...\n\n### Attack Training (P2P)\n1. Use Sand Crabs..."
}
```

---

### **GET /skills/export**
Exports all skill summaries in JSON or Markdown.

**Example Response**
```json
[
  { "id": 1, "name": "Attack", "summary": "### F2P\nTrain..." },
  { "id": 2, "name": "Mining", "summary": "### P2P\nUse..." }
]
```

---

### **POST /skills/update**
Triggers re-fetching and summarization from the OSRS Wiki.

**Example Response**
```json
{
  "status": "success",
  "updated": 23,
  "timestamp": "2025-10-13T18:42:00Z"
}
```

---

### **Error Responses**
```json
{ "detail": "Skill not found" }
```
or
```json
{ "detail": "Internal Server Error" }
```


---

## Developer Guide

### 1. Backend Overview

FastAPI + PostgreSQL handle fetching, summarizing, storing, and serving skill data.

Core files:
- `app.py` – Routes and server logic  
- `skill_fetcher.py` – Fetches and summarizes OSRS Wiki data  
- `summarize_skills.py` – Exports summaries to OpenAI for processing 
- `models.py` – Postgresql model

---

### 2. Database Schema

```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  content TEXT,
  hash TEXT,
  summary TEXT,
);



Initialize:
```bash
psql -U postgres -d osrssimplified -f database/init.sql
```

---

### 3. Automated Summary Updates

Manual run:
```bash
python skill_fetcher.py
```

Then:
```bash
python summarize_skills.py
```

---

### 4. Adding New Endpoints

```python
@app.get("/skills/search")
def search_skills(query: str):
    results = db.query(Skill).filter(Skill.name.ilike(f"%{query}%")).all()
    return results
```

Restart FastAPI:
```bash
uvicorn main:app --reload
```

---

### 5. Frontend Integration

Data is fetched in:
```
frontend/app/skills/page.tsx
frontend/app/skills/[skill]/page.tsx
```

Production URL:
```
NEXT_PUBLIC_API_URL=https://api.osrssimplified.com
```

---

### 6. Testing & Development

- **Frontend:** Jest + React Testing Library  
- **Backend:** Pytest  
- **Integration:** MSW mocks for FastAPI responses  

---

### 7. Extending Summaries

Edit directly in PostgreSQL or Markdown files, then export:

```bash
python export_summaries.py
```

---

### 8. Deployment Notes

Frontend → **Vercel / Netlify**  
Backend → **Render / Railway / VPS**

Environment variables:
```
DATABASE_URL=postgresql://user:password@host:port/osrssimplified
CORS_ORIGINS=["https://osrssimplified.com"]
```

---

### 9. Maintenance Checklist

Verify monthly summary updates  
Check FastAPI logs  
Validate icons in `/public/icons`  
Backup PostgreSQL monthly  
Review docs and license yearly  

---

## License

**Creative Commons Attribution-NonCommercial (CC BY-NC)**  
You may **use or modify** this project freely,  
but **commercial use is not permitted**.

---

## Future Plans

- Quests Simplified 
- Interactive OSRS Map 
- Money Making Guides


---

 
*Video credit: [Melankola on YouTube](https://www.youtube.com/watch?v=D7EGZDfTWO0)*  
