# Datastraw Support Ticketing CRM

Full-stack customer support ticketing system built for the Datastraw Technologies intern assessment.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)

## Project Structure
```
datastraw-crm/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/       # Supabase client setup
│   │   ├── routes/       # API route definitions
│   │   └── controllers/  # Request handlers / business logic
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/         # React + Vite app
│   ├── src/
│   └── package.json
├── supabase/
│   └── schema.sql    # Database schema — run this in Supabase SQL editor
└── README.md
```

## Setup Instructions

### 1. Database (Supabase)
1. Create a project at https://supabase.com (or use an existing one)
2. Go to SQL Editor → paste and run `supabase/schema.sql`
3. Go to Settings → API → copy your **Project URL** and **service_role key** (not the anon key)

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env with your Supabase URL and service_role key
npm run dev
```
Server runs on http://localhost:5000

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173

## Build Phases
- [x] Phase 0: Project setup & structure
- [x] Phase 1: Database schema
- [ ] Phase 2: Backend API (4 endpoints)
- [ ] Phase 3: Frontend (list, create, detail, search/filter)
- [ ] Phase 4: Integration testing
- [ ] Phase 5: Deployment
- [ ] Phase 6: README finalization, demo video, submission email
