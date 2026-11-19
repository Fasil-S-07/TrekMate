# TrekMate — Trekking Management System

A student mini project for discovering treks, registering users, making bookings, and administering trek listings.

## Stack
- React + Vite frontend
- Node.js + Express REST API
- MongoDB + Mongoose
- JWT authentication and bcrypt password hashing

## Structure
```
TrekMate/
├── frontend/       React application
├── backend/        Express API
├── .gitignore
└── README.md
```

## Requirements
Node.js 20+, npm, and MongoDB (local or MongoDB Atlas).

## Run locally

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and set MONGODB_URI and a long random JWT_SECRET
npm install
npm run dev
```

### Frontend (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173. The frontend defaults to API URL http://localhost:5000/api; override with `frontend/.env` using `VITE_API_URL`.

## API overview
- GET `/api/health` — health check
- GET `/api/treks` — browse active treks; supports `search` and `difficulty`
- GET `/api/treks/:id` — trek detail
- POST `/api/auth/register` — register
- POST `/api/auth/login` — login; returns JWT
- GET `/api/bookings/mine` — current user's bookings
- POST `/api/bookings` — create booking
- GET/POST `/api/admin/treks` — admin trek listing/create
- PATCH/DELETE `/api/admin/treks/:id` — update/archive trek
- GET `/api/admin/bookings` — admin booking listing
- PATCH `/api/admin/bookings/:id/status` — update booking status

## Admin account
Registration creates a normal user. The frontend exposes the My Bookings page to signed-in users and the Admin dashboard to admin users. For local development only, update that user's `role` to `admin` in the MongoDB database to test admin endpoints.

## Security and scope
Never commit real secrets or `.env`. Do not use real payment details or sensitive user data. This is an educational starter, not a production booking platform. Add automated tests, rate limiting, stronger validation, password recovery, email verification, booking-capacity concurrency controls, and production deployment hardening before real-world use.

Build on this project, test every feature, and describe only functionality you have actually implemented in your college report and viva.
