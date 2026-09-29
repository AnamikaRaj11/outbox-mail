# Outbox Mail Scheduler (ReachInbox Assignment)

A production-grade email scheduler service and dashboard.

## Architecture Overview
- **Backend:** Node.js, Express, TypeScript, BullMQ, Redis, PostgreSQL (via Prisma).
- **Frontend:** React, TypeScript, TailwindCSS, Vite.
- **Scheduling Logic:** 
  Emails are scheduled using **BullMQ delayed jobs**. We do not use cron jobs. When a request is received, an email job is placed in the queue with a delay calculated based on the requested `scheduledAt` time.
- **Persistence on Restart:**
  Because BullMQ is backed by Redis (which persists jobs) and the scheduled time is absolute, if the server restarts, BullMQ immediately picks up where it left off. Future jobs remain delayed in Redis.
- **Concurrency & Rate Limiting:**
  - **Concurrency:** The BullMQ worker is configured to process multiple jobs in parallel (`concurrency: 5`).
  - **Delay:** Each job forces a minimum delay of 2 seconds before sending via Ethereal SMTP to mimic provider throttling.
  - **Rate Limiting:** (Designed) The system checks Redis-backed counters per sender per hour window. If the limit is reached, jobs are delayed to the next hour window rather than failed.

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- A running PostgreSQL instance
- A running Redis instance

### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with your `DATABASE_URL` and `REDIS_URL`.
4. `npx prisma db push`
5. `npm run dev` (Runs on `http://localhost:3000`)
*(BullMQ Dashboard is available at `http://localhost:3000/admin/queues`)*

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on `http://localhost:5173`)

### Environment Variables (.env)
```env
PORT=3000
DATABASE_URL="postgresql://..."
REDIS_URL="rediss://..."
MAX_EMAILS_PER_HOUR=200
```

## Features Implemented
- [x] Accept email scheduling requests via API (with CSV parsing on frontend).
- [x] Store in Postgres.
- [x] Schedule using BullMQ delayed jobs (NO cron).
- [x] Send emails using fake SMTP (Ethereal Email).
- [x] Persist state across server restarts.
- [x] Live BullMQ dashboard.
- [x] Google Login Mock (OAuth placeholder).
- [x] Dashboard UI (Scheduled & Sent tabs).
- [x] Compose New Email modal (subject, body, CSV leads, start time, hourly limit).
