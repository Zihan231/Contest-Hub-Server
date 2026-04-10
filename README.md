# ContestHub Server

A production-ready Node.js REST API backend for managing online contests with role-based access control, Firebase authentication, payment integration, and MongoDB data persistence.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5+-blue?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-ISC-blue)](#license)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

**ContestHub Server** is a comprehensive backend solution designed for a modern contest platform. It provides secure REST API endpoints for managing contests, user accounts, creator profiles, and administrative functions. Built with Express.js and MongoDB, it leverages Firebase for robust authentication and Stripe for payment processing.

The server implements a sophisticated role-based access control system distinguishing between:
- **Public Users** - Browse contests, view leaderboards
- **Registered Users** - Participate in contests, submit tasks, track performance
- **Creators** - Create and manage contests, declare winners
- **Administrators** - Oversee platform, manage roles, approve contests

## Features

### Core Functionality
- ✅ **Firebase Authentication** - Industry-standard token-based authentication with secure token verification
- ✅ **Role-Based Access Control (RBAC)** - Granular permission system for Users, Creators, and Admins
- ✅ **Contest Management** - Full CRUD operations for contest creation, updates, and deletion
- ✅ **User Management** - Registration, profile management, role assignment, and performance tracking
- ✅ **Payment Processing** - Stripe integration for secure contest participation payments
- ✅ **Leaderboard System** - Real-time leaderboard and user ranking
- ✅ **Winner Declaration** - Contest creators can mark winners and track win history
- ✅ **Search & Filter** - Contest search with popularity ranking and filtering
- ✅ **Participant Tracking** - Contest participation management and statistics

### Technical Features
- 🔐 **Secure Token Verification** - Firebase ID token validation on protected routes
- 🛡️ **CORS Protection** - Configured for trusted client domains only
- 📊 **MongoDB Native Driver** - Direct database connectivity for optimal performance
- 🚀 **Vercel Ready** - Pre-configured for serverless deployment
- 🔑 **Environment Security** - Sensitive credentials managed via `.env` file
- ⚡ **RESTful Architecture** - Clean, organized route structure by domain
- 📝 **Error Handling** - Standardized HTTP responses and error messages
- 🔄 **Stateful Operations** - Contest status workflows (Pending → Approved)

## Technology Stack

| Technology | Purpose | Version |
|:---|:---|:---|
| **Node.js** | JavaScript Runtime | v14+ |
| **Express.js** | Web Framework | v5.2.1 |
| **MongoDB** | NoSQL Database | v7.0.0+ |
| **Firebase Admin** | Authentication & Token Verification | v13.6.0 |
| **Stripe** | Payment Processing | v20.1.0 |
| **CORS** | Cross-Origin Resource Sharing | v2.8.5 |
| **Dotenv** | Environment Variable Management | v17.2.3 |

## Project Structure

```
contesthub-server/
├── src/
│   ├── config/
│   │   ├── db.js                          # MongoDB connection & collection management
│   │   └── firebase.json                  # Firebase service account credentials
│   │
│   ├── controllers/
│   │   ├── admin/
│   │   │   └── admin.controller.js        # Admin operations (users, contests, roles)
│   │   ├── creator/
│   │   │   └── creator.controller.js      # Contest creation & management
│   │   ├── public/
│   │   │   └── public.controller.js       # Public contest browsing & signup
│   │   └── user/
│   │       └── user.controller.js         # User profile & contest participation
│   │
│   ├── middleware/
│   │   └── FirebaseAuth/
│   │       └── verifyFirebaseToken.js     # Firebase token verification middleware
│   │
│   └── routes/
│       ├── admin/
│       │   └── admin.route.js             # Admin endpoint routes
│       ├── creator/
│       │   └── creator.route.js           # Creator endpoint routes
│       ├── public/
│       │   └── public.route.js            # Public endpoint routes
│       └── user/
│           └── user.route.js              # User endpoint routes
│
├── .env                                   # Environment variables (not committed)
├── .env.example                           # Environment variables template
├── .gitignore                             # Git ignore rules
├── index.js                               # Application entry point
├── package.json                           # Dependencies & scripts
├── vercel.json                            # Vercel deployment configuration
└── README.md                              # This file
```

## Prerequisites

- **Node.js** version 14.0.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Firebase** project ([Console](https://console.firebase.google.com))
- **Stripe** account for payment processing ([Sign up](https://stripe.com))
- **Git** for version control ([Download](https://git-scm.com/))

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/contesthub-server.git
cd contesthub-server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration values (see [Environment Configuration](#environment-configuration))

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
DB_UserName=your_mongodb_username
DB_Pass=your_mongodb_password

# Firebase Configuration (Base64 encoded service account JSON)
FB_SERVICE_KEY=your_base64_encoded_firebase_service_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://your-frontend-domain.vercel.app
```

### Setting Up Firebase Service Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings
3. Download service account key (JSON file)
4. Convert to Base64:
   ```bash
   cat your-service-account-key.json | base64
   ```
5. Paste the Base64 string into `FB_SERVICE_KEY`

### MongoDB Connection String

The connection string is constructed in `src/config/db.js`:
```javascript
mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Pass}@your-cluster.mongodb.net/?appName=ContestHub
```

Ensure your MongoDB Atlas IP whitelist includes your deployment server's IP.

## Running the Server

### Development Mode
```bash
npm run dev
```
Requires `nodemon` to be installed globally or as a dev dependency.

### Production Mode
```bash
npm start
```

### Default Port
The server runs on `http://localhost:5000` (configurable via `PORT` env variable)

### Health Check
```bash
curl http://localhost:5000/
```
Expected response:
```
Contest Hub Server is running !!!
```

## API Documentation

### Authentication

All protected endpoints require a **Firebase ID Token** in the Authorization header:

```http
Authorization: Bearer <firebase_id_token>
```

### Base URL
```
http://localhost:5000
```

### Public Endpoints

#### Sign Up / User Creation
```http
POST /public/signUp
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "photoURL": "https://example.com/photo.jpg"
}
```
**Response:** `201 Created`

#### Get All Approved Contests
```http
GET /public/contests
```
**Response:** Array of contest objects

#### Get Leaderboard
```http
GET /public/leaderboard
```
**Response:** User rankings sorted by wins/performance

#### Get Popular Contests
```http
GET /public/contests/popular
```
**Response:** Top-ranked contests by participation

#### Get User Role
```http
GET /public/user/getRole/:email
```
**Response:** User role (user/creator/admin)

#### Search Contests
```http
GET /public/contests/find?search=keyword
```
**Response:** Filtered contest results

---

### Admin Endpoints
**Base URL:** `/admin`

#### Get All Users
```http
GET /admin/
Authorization: Bearer <token>
```
**Required:** Admin role

#### Change User Role
```http
PATCH /admin/role/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "creator"
}
```

#### Update Contest Status
```http
PATCH /admin/status/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"
}
```

#### Delete Contest
```http
DELETE /admin/delete/:id
Authorization: Bearer <token>
```

#### Get Pending Contests
```http
GET /admin/pending
Authorization: Bearer <token>
```

---

### Creator Endpoints
**Base URL:** `/creator/contest`

#### Create Contest
```http
POST /creator/contest/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Development Challenge",
  "description": "Build a responsive website",
  "prize": 1000,
  "deadline": "2026-02-28T23:59:59Z",
  "creatorEmail": "creator@example.com"
}
```

#### Update Contest
```http
PATCH /creator/contest/update/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Contest
```http
DELETE /creator/contest/delete/:id
Authorization: Bearer <token>
```

#### Declare Winner
```http
PATCH /creator/contest/declare/winner
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "123",
  "winnerEmail": "winner@example.com"
}
```

#### Get Contest Participants
```http
POST /creator/contest/all-participants
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "123"
}
```

#### Get Creator's Contests
```http
GET /creator/contest/all/:email
Authorization: Bearer <token>
```

---

### User Endpoints
**Base URL:** `/user`

#### Get User Profile
```http
GET /user/profile/
Authorization: Bearer <token>
```
**Response:** User profile data

#### Get User by Email
```http
GET /user/profile/?email=user@example.com
Authorization: Bearer <token>
```

#### Update Profile
```http
PATCH /user/profile/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "photoURL": "https://example.com/new-photo.jpg"
}
```

#### Get Contest by ID
```http
GET /user/profile/:id
Authorization: Bearer <token>
```

#### Get Contest Participants
```http
POST /user/contest/participants
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "123"
}
```

#### Get Participated Contests
```http
GET /user/contest/participated/:email
Authorization: Bearer <token>
```

#### Join Contest
```http
POST /user/contest/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "123",
  "email": "user@example.com"
}
```

#### Get Win Rate
```http
GET /user/contest/winRate/:id
Authorization: Bearer <token>
```

#### Process Payment (Stripe)
```http
POST /user/contest/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "123",
  "amount": 9900,
  "currency": "usd"
}
```

#### Check Payment Status
```http
PATCH /user/contest/payment/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "cs_test_xxxxx"
}
```

#### Submit Task
```http
PATCH /user/contest/submit-task
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "123",
  "submissionUrl": "https://github.com/user/submission"
}
```

#### Get Win History
```http
GET /user/contest/win/history
Authorization: Bearer <token>
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  photoURL: String,
  role: String, // "user" | "creator" | "admin"
  joinedAt: Date,
  contests: [ObjectId], // Array of contest IDs
  winHistory: [ObjectId], // Array of won contest IDs
  profile: {
    bio: String,
    socialLinks: Object
  }
}
```

### Contests Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  creatorEmail: String,
  creatorId: ObjectId,
  prize: Number,
  participationFee: Number,
  startDate: Date,
  deadline: Date,
  status: String, // "pending" | "approved" | "rejected" | "completed"
  participants: [String], // Array of email addresses
  winner: String, // Winner email
  submissions: [
    {
      email: String,
      submissionUrl: String,
      submittedAt: Date,
      isWinner: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  email: String,
  contestId: ObjectId,
  amount: Number,
  currency: String,
  stripSessionId: String,
  status: String, // "pending" | "completed" | "failed"
  transactionId: String,
  createdAt: Date,
  completedAt: Date
}
```

## Middleware

### verifyFirebaseToken

**Location:** `src/middleware/FirebaseAuth/verifyFirebaseToken.js`

Validates Firebase ID tokens on protected routes.

**Usage:**
```javascript
const verifyFirebaseToken = require('../../middleware/FirebaseAuth/verifyFirebaseToken');

router.get('/protected-route', verifyFirebaseToken, handler);
```

**Behavior:**
- Extracts Bearer token from Authorization header
- Verifies token with Firebase Admin SDK
- Attaches `req.decodedEmail` for use in handlers
- Returns 401 if no token provided
- Returns 403 if token is invalid

## Deployment

### Deploy to Vercel

#### Prerequisites
- Vercel account ([Sign up](https://vercel.com))
- GitHub repository connected to Vercel

#### Deployment Steps

1. **Connect your repository to Vercel**
   ```bash
   vercel link
   ```

2. **Set environment variables in Vercel Dashboard**
   - Go to: Project Settings → Environment Variables
   - Add all variables from your `.env` file

3. **Deploy to production**
   ```bash
   vercel --prod
   ```

4. **Verify deployment**
   ```
   https://your-project-name.vercel.app/
   ```

#### Vercel Configuration

The `vercel.json` file is pre-configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

#### Post-Deployment

Update your frontend CORS configuration and API endpoints to point to your production URL.

## Troubleshooting

### Common Issues

#### "DB connection failed"
- **Check:** MongoDB credentials in `.env`
- **Verify:** IP address is whitelisted in MongoDB Atlas
- **Test:** Connection string with MongoDB Compass

#### "Unauthorized access: No token provided"
- **Fix:** Include `Authorization: Bearer <token>` header
- **Verify:** Token is valid Firebase ID token

#### "Forbidden access: Invalid token"
- **Issue:** Firebase token has expired or is malformed
- **Solution:** Refresh token from client application

#### "CORS Error"
- **Check:** Frontend URL is in CORS whitelist in `index.js`
- **Update:** Add new URLs to `cors` configuration

#### "Firebase service key not found"
- **Verify:** `FB_SERVICE_KEY` environment variable is set
- **Check:** Base64 encoding is correct
- **Debug:** Decode and validate JSON structure

### Debug Mode

Enable detailed logging by modifying `verifyFirebaseToken.js`:

```javascript
console.log("Verified User:", decode); // Uncomment this line
```

## Code Organization

### Controllers
Each controller file handles business logic for its domain:
- **admin.controller.js** - Administrative operations (user management, contest approval)
- **creator.controller.js** - Contest creation and management
- **public.controller.js** - Public data access (contests, leaderboards, signup)
- **user.controller.js** - User profile and participation operations

### Routes
Routes are organized by role/domain and import corresponding controllers. Each route file applies appropriate middleware.

### Configuration
- **db.js** - MongoDB connection pooling and collection references
- **firebase.json** - Firebase service account credentials

## Error Handling

The API returns standard HTTP status codes:

| Code | Meaning | Example |
|:---|:---|:---|
| 200 | Success | Contest retrieved successfully |
| 201 | Created | User or contest created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No authentication token provided |
| 403 | Forbidden | Invalid or expired token |
| 404 | Not Found | Contest or user doesn't exist |
| 500 | Server Error | Database connection failure |

Error response format:
```json
{
  "message": "Descriptive error message",
  "code": "ERROR_CODE"
}
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/contesthub-server.git
   cd contesthub-server
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Describe the changes
   - Reference any related issues

## License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 📬 Support & Contact


<p align="center">
  <img src="https://github.com/Zihan231.png" alt="Zihan231" width="120" style="border-radius:50%"/>
</p>

<p align="center">
  <b>ContestHUb</b> was created with ❤️ by <a href="https://github.com/Zihan231">Zihan231</a>
</p>

<p align="center">
  <a href="https://facebook.com/Zihan231" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="30px" alt="Facebook"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/zihan231" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="30px" alt="LinkedIn"/>
</a>
  &nbsp;&nbsp;
  <a href="https://instagram.com/zihan_islam_19" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30px" alt="Instagram"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Zihan231" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="30px" alt="GitHub"/>
  </a>
</p>

---

**Last Updated:** January 2026  
**Status:** Production Ready ✅
