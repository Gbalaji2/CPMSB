# College Placement Management System (CPMS) - Backend

This is the **backend** for the College Placement Management System (CPMS), built with **Node.js**, **Express**, and **MongoDB**. It handles authentication, user management, company and job management, applications, interviews, and analytics.

---

## Table of Contents

- [Features](#features)  
- [Technologies](#technologies)  
- [Folder Structure](#folder-structure)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Running the Server](#running-the-server)  
- [API Overview](#api-overview)  
- [Socket.IO Integration](#socketio-integration)  
- [Cron Jobs](#cron-jobs)  
- [Swagger Documentation](#swagger-documentation)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **User Authentication & Authorization**  
  - JWT-based authentication for students, companies, and admin users.  
  - Role-based access control.  

- **Student Management**  
  - Profiles with CGPA, department, and year.  
  - Import students via CSV.  

- **Company Management**  
  - Create and manage company profiles.  
  - Upload company logos.  
  - Verification by admin.  

- **Job Management**  
  - Create jobs with eligibility criteria.  
  - CRUD operations for jobs.  
  - Open/closed status tracking.  

- **Application Management**  
  - Students can apply for jobs.  
  - Track application status: shortlisted, rejected, etc.  

- **Interview Management**  
  - Schedule interviews with virtual or in-person formats.  
  - Reminder notifications via Socket.IO.  
  - Agora integration for virtual interviews.  

- **Admin Analytics**  
  - Jobs per company, applications per job, student leaderboard.  
  - User and company statistics.  

- **Notifications**  
  - Real-time interview reminders via Socket.IO.  

- **Swagger API Documentation**  

---

## Technologies

- **Node.js** & **Express**  
- **MongoDB** & **Mongoose**  
- **JWT** for authentication  
- **Socket.IO** for real-time notifications  
- **Cloudinary** for file uploads (logos, images)  
- **Cron Jobs** (`node-cron`) for reminders  
- **Swagger** for API documentation  
- **Multer** for file uploads  

---

## Folder Structure
src/
├── config/ # DB, Cloudinary, Socket configurations
├── controllers/ # Route controllers
├── cron/ # Cron jobs (e.g., interview reminders)
├── models/ # MongoDB models (User, Company, Job, Application, Interview)
├── routes/ # Express routes
├── utils/ # Utility functions (asyncHandler, CSV import, email, swagger setup)
├── validators/ # Input validation using Joi
├── app.js # Express app setup
└── server.js # Entry point (HTTP server + Socket.IO + Cron jobs)


---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

Install dependencies:

npm install

Create a .env file in the root directory and add the following variables:

PORT=5000
MONGO_URI=<your_mongodb_uri>
ACCESS_TOKEN_SECRET=<jwt_secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
EMAIL_SERVICE=<email_service>
EMAIL_USER=<email_user>
EMAIL_PASSWORD=<email_password>
AGORA_APP_ID=<agora_app_id>
AGORA_APP_CERTIFICATE=<agora_app_certificate>

Important: Do not commit .env to GitHub. Add it to .gitignore.

Running the Server

Development mode (with auto-restart):

npm run dev

**Production mode:**

npm start

Server runs on http://localhost:5000 by default.

**API Overview**

Auth Routes: /api/auth

Register/Login for students, companies, admin.

User Routes: /api/users

Get profile, update profile, admin management.

Company Routes: /api/companies

CRUD for company profiles, logo upload, dashboard stats.

Job Routes: /api/jobs

CRUD jobs, list jobs, filter by eligibility.

Application Routes: /api/applications

Apply to jobs, track status, shortlist.

Interview Routes: /api/interviews

Schedule, list, reminders, and virtual meeting links.

Admin Routes: /api/admin

Analytics, user & company management, CSV import.

Socket.IO Integration

Real-time notifications using Socket.IO.

Students join a room user_<studentId> for interview reminders.

Companies/admin join role_<role> rooms.

Example event:

{
  "event": "interviewReminder",
  "message": "Your interview with ABC Corp is at 10:30 AM",
  "interviewId": "637f1c0a..."
}
Cron Jobs

Interview Reminder Cron: Runs every minute and sends notifications to students 15 minutes before their interview.

Uses node-cron and Socket.IO.

Swagger Documentation

API documentation is available via Swagger.

Access at: http://localhost:5000/api-docs

Contributing

Fork the repository

Create a branch: git checkout -b feature/xyz

Commit your changes: git commit -m "Add feature xyz"

Push to branch: git push origin feature/xyz

Create a Pull Request
