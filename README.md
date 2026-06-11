# Attendance Management System (AMS)

A full-stack MERN application for managing employee attendance with role-based access control, selfie punch-in/out, geolocation tracking, and an overtime approval workflow.

---

## Architecture Overview

```
Attendence_Management_System/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── app/             # Redux store + RTK Query apiSlice
│       ├── features/        # auth / attendance / overtime API slices
│       ├── components/      # Navbar, CameraCapture, StatusBadge
│       ├── pages/           # Login, Register, Dashboard, Camera, OvertimeRequest
│       │   ├── employee/
│       │   ├── manager/
│       │   └── admin/
│       └── routes/          # ProtectedRoute, RoleRoute
└── server/                  # Node.js + Express backend
    └── src/
        ├── config/          # MongoDB connection
        ├── controllers/     # authController, attendanceController, overtimeController
        ├── middleware/       # JWT auth, RBAC, Zod validation
        ├── models/          # User, Attendance, Overtime
        ├── routes/          # authRoutes, attendanceRoutes, overtimeRoutes
        └── utils/           # Winston logger
```

---

## Features

- **Auth** — Register/Login with JWT, bcrypt password hashing
- **RBAC** — Employee, Manager, Admin roles with protected routes
- **Punch In/Out** — Webcam selfie capture (base64), geolocation, timestamp
- **Attendance Status** — Auto-computed: `Completed` (≥8h), `Incomplete` (<8h)
- **Validation** — Managers mark attendance Valid/Invalid with remarks
- **Overtime** — Employees request overtime; Managers Approve/Reject
- **Dashboards** — Role-specific views with color-coded status badges
- **Logging** — Winston + Morgan for structured HTTP and app logs

---

## Tech Stack

| Layer     | Technologies                                              |
|-----------|-----------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Redux Toolkit, RTK Query    |
| Backend   | Node.js, Express.js, Mongoose, Winston, Morgan            |
| Auth      | JSON Web Tokens, bcryptjs                                 |
| Validation| Zod (server-side schema validation)                       |
| Database  | MongoDB                                                   |

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Copy the example env and fill in your values
cp .env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
```

### 3. Run the Application

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## API Endpoints

| Method | Endpoint                        | Access           | Description                  |
|--------|---------------------------------|------------------|------------------------------|
| POST   | /api/auth/register              | Public           | Register new user            |
| POST   | /api/auth/login                 | Public           | Login, returns JWT           |
| GET    | /api/auth/me                    | Protected        | Get current user             |
| POST   | /api/attendance/punch-in        | Employee+        | Punch in with selfie         |
| POST   | /api/attendance/punch-out       | Employee+        | Punch out with selfie        |
| GET    | /api/attendance/today           | Employee+        | Today's attendance record    |
| GET    | /api/attendance/my              | Employee+        | Last 30 days records         |
| GET    | /api/attendance/all             | Manager, Admin   | All employees' attendance    |
| PATCH  | /api/attendance/:id/validate    | Manager, Admin   | Validate attendance record   |
| POST   | /api/overtime                   | Employee+        | Request overtime             |
| GET    | /api/overtime/my                | Employee+        | Own overtime requests        |
| GET    | /api/overtime/all               | Manager, Admin   | All overtime requests        |
| PATCH  | /api/overtime/:id/review        | Manager, Admin   | Approve/Reject overtime      |

---

## Assumptions

1. One attendance record is allowed per employee per calendar day.
2. Punch-out is not allowed without a prior punch-in on the same day.
3. Total hours are computed server-side as `(punchOut - punchIn)` in hours.
4. Selfie images are stored as base64 strings directly in MongoDB (suitable for development; use S3/object storage in production).
5. Geolocation is optional — if the browser denies permission, location is stored as `null`.
6. JWT tokens expire after 7 days.
7. The `Admin` role has all Manager capabilities plus the full admin dashboard view.
