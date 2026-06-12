# Attendance Management System (AMS)

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing employee attendance with role-based access control, selfie-based punch-in/out, geolocation tracking, attendance validation, and overtime management.

---

# Architecture Overview

The application follows a client-server architecture.

## Frontend (React + Vite)

* React 18 for UI development
* Redux Toolkit & RTK Query for state management and API communication
* Tailwind CSS for styling
* Protected routes based on user roles

### Main Modules

* Authentication
* Employee Dashboard
* Manager Dashboard
* Admin Dashboard
* Attendance Management
* Overtime Management

## Backend (Node.js + Express)

* RESTful API architecture
* JWT-based authentication
* Role-Based Access Control (RBAC)
* MongoDB database integration using Mongoose
* Request validation using Zod
* Logging using Winston and Morgan

## Project Structure

```text
Attendance_Management_System/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

# Features Implemented

## Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcrypt
* Role-Based Access Control (Employee, Manager, Admin)

## Attendance Management

* Selfie-based Punch In
* Selfie-based Punch Out
* Timestamp Recording
* Employee Attendance History
* Automatic Working Hours Calculation

## Attendance Validation

* Manager/Admin Validation
* Valid / Invalid Status
* Remarks Support

## Overtime Management

* Employee Overtime Requests
* Manager/Admin Approval Workflow
* Approve / Reject Actions
* Overtime Request Tracking

## Dashboards

### Employee Dashboard

* Punch In/Out
* View Attendance
* Submit Overtime Requests

### Manager Dashboard

* Review Attendance Records
* Validate Attendance
* Review Overtime Requests

### Admin Dashboard

* Complete System Access
* Attendance Monitoring
* User Management Features

## Additional Features

* Geolocation Capture
* Webcam Selfie Capture
* Protected Routes
* Structured Logging
* Responsive User Interface

---

# Setup Instructions

## Prerequisites

* Node.js (v18 or above)
* MongoDB Atlas Account or Local MongoDB
* Git

---

## Clone Repository

```bash
git clone <repository-url>
cd Attendance_Management_System
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=mongodb_connection_string
JWT_SECRET=jwt_key
NODE_ENV=development
```

Run Backend:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

---

## Production Deployment

### Frontend

Deployed on Vercel.

### Backend

Deployed on Render.

### Database

Hosted on MongoDB Atlas.

---

# API Endpoints

## Authentication

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me

## Attendance

* POST /api/attendance/punch-in
* POST /api/attendance/punch-out
* GET /api/attendance/today
* GET /api/attendance/my
* GET /api/attendance/all
* PATCH /api/attendance/:id/validate

## Overtime

* POST /api/overtime
* GET /api/overtime/my
* GET /api/overtime/all
* PATCH /api/overtime/:id/review

---

# Assumptions Made

1. A user can create only one attendance record per day.

2. Punch-out is allowed only after a successful punch-in.

3. Attendance status is calculated automatically based on total working hours.

4. Working hours greater than or equal to 8 hours are marked as Completed.

5. Working hours less than 8 hours are marked as Incomplete.

6. Selfie images are stored directly in MongoDB as Base64 strings for simplicity.

7. Geolocation information is optional and depends on browser permission.

8. JWT tokens remain valid for 7 days.

9. Managers can validate attendance and review overtime requests.

10. Admin users have complete access to all management features.

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* RTK Query

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JWT
* bcryptjs

## Validation

* Zod

## Logging

* Winston
* Morgan
