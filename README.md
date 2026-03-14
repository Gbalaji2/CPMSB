# College Placement Management System (CPMS) - Backend

This is the backend for the **College Placement Management System (CPMS)** built using **Node.js, Express, and MongoDB**.
It manages authentication, student profiles, company job postings, applications, interviews, and analytics for college placement drives.

---

# Table of Contents

* Features
* Technologies
* Folder Structure
* Installation
* Environment Variables
* Running the Server
* Sample Credentials
* API Overview
* Socket.IO Integration
* Cron Jobs
* Swagger Documentation
* Contributing
* License

---

# Features

## User Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Roles:

  * Admin
  * Student
  * Company

---

## Student Management

* Student profile with:

  * CGPA
  * Department
  * Graduation year
* CSV import for bulk student creation

---

## Company Management

* Company profile creation
* Company logo upload
* Admin verification system

---

## Job Management

* Create jobs with eligibility criteria
* Job CRUD operations
* Open / closed job status

---

## Application Management

Students can:

* Apply to jobs
* Track application status
* View shortlisted / rejected results

---

## Interview Management

* Schedule interviews
* Support:

  * Virtual interviews
  * In-person interviews
* Agora integration for virtual interviews
* Real-time reminders

---

## Admin Analytics

Admin dashboard provides:

* Jobs per company
* Applications per job
* Student placement leaderboard
* Overall placement statistics

---

## Real-Time Notifications

Using **Socket.IO**

* Interview reminders
* Status updates
* Notification rooms

---

## Swagger API Documentation

Interactive API testing using Swagger.

---

# Technologies

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Authentication

* JWT (JSON Web Tokens)

Real-time communication

* Socket.IO

File Upload

* Multer
* Cloudinary

Scheduling

* node-cron

API Documentation

* Swagger

Security

* Helmet
* Rate limiting
* CORS

---

# Folder Structure

```
src
├── config/          # Database, Cloudinary, Socket configuration
├── controllers/     # Business logic
├── cron/            # Cron jobs (interview reminders)
├── middleware/      # Auth, role, error middleware
├── models/          # MongoDB models
├── routes/          # Express routes
├── utils/           # Helper utilities
├── validators/      # Joi validation schemas
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

---

# Installation

Clone the repository

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

Install dependencies

```
npm install
```

---

# Environment Variables

Create `.env` file in root directory.

Example:

```
PORT=5000

MONGO_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

AGORA_APP_ID=your_agora_id
AGORA_APP_CERTIFICATE=your_agora_certificate
```

⚠️ Do **not commit `.env` to GitHub**.

Add it to `.gitignore`.

---

# Running the Server

Development mode

```
npm run dev
```

Production mode

```
npm start
```

Server runs at:

```
http://localhost:5000
```

---

# Sample Credentials

These credentials can be used for testing the application.

## Admin

Email

```
admin@test.com
```

Password

```
admin123
```

---

## Student

Email

```
student@test.com
```

Password

```
student123
```

---

## Company

Email

```
company@test.com
```

Password

```
company123
```

---

# API Base URL

```
http://localhost:5000/api
```

---

# API Overview

## Auth Routes

```
/api/auth
```

Endpoints

* Register
* Login
* Refresh token
* Logout
* Get current user

---

## Student Routes

```
/api/students
```

Features

* View profile
* Update profile
* View jobs
* Apply to jobs

---

## Company Routes

```
/api/companies
```

Features

* Company profile management
* Upload logo
* Company dashboard

---

## Job Routes

```
/api/jobs
```

Features

* Create job
* Update job
* Delete job
* View job listings

---

## Application Routes

```
/api/applications
```

Features

* Apply to jobs
* View application status
* Shortlist / reject candidates

---

## Interview Routes

```
/api/interviews
```

Features

* Schedule interviews
* Manage interview slots
* Send reminders

---

## Admin Routes

```
/api/admin
```

Features

* Manage users
* Company verification
* CSV student import
* Analytics dashboard

---

# Socket.IO Integration

Real-time communication using Socket.IO.

Room structure:

```
user_<userId>
role_<role>
```

Example notification event:

```
{
  "event": "interviewReminder",
  "message": "Your interview with ABC Corp is at 10:30 AM",
  "interviewId": "637f1c0a..."
}
```

---

# Cron Jobs

Interview Reminder Cron

* Runs every minute
* Sends notification **15 minutes before interview**

Uses:

* node-cron
* Socket.IO

---

# Swagger Documentation

API documentation available at:

```
http://localhost:5000/api-docs
```
