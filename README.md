# ⚙️ Contest Hub - Server Side

**Contest Hub Server** is the backend REST API powering the Contest Hub platform. It handles authentication, secure payment processing via Stripe, complex database queries, and role-based access control for Admins, Creators, and Users.

---

## 🔗 **Live Links**

- **📂 Server API:** [https://contesthub-server-dun.vercel.app/](https://contesthub-server-dun.vercel.app/)
- **🚀 Live Client:** [https://contesthub-a21c5.web.app/](https://contesthub-a21c5.web.app/)
- **💻 Client Repo:** [GitHub - Client](https://github.com/Zihan231/Contest-Hub-Client)
- **⚙️ Server Repo:** [GitHub - Server](https://github.com/Zihan231/Contest-Hub-Server)

---

## 🌟 **Key Features**

* **Secure Authentication:** JWT (JSON Web Token) verification middleware to secure private routes.
* **Role-Based Access Control (RBAC):** Custom middleware (`verifyAdmin`, `verifyCreator`) to restrict endpoints based on user roles.
* **Payment Integration:** Stripe Checkout Session creation and webhook-style payment verification endpoints.
* **Database Management:** MongoDB aggregation pipelines to calculate stats, leaderboards, and contest participation counts efficiently.
* **RESTful API:** Well-structured endpoints for Users, Contests, and Payments.

---
## ✨ Server Features

* **🔐 JWT Authentication:** Secure JSON Web Token implementation to protect private API routes and verify user identities.
* **🛡️ Role-Based Middleware:** Custom middleware (`verifyAdmin`, `verifyCreator`) to strictly enforce access control for sensitive endpoints.
* **💳 Stripe Payment Integration:** Backend logic to create secure Checkout Sessions and verify payment statuses via `session_id`.
* **📊 MongoDB Aggregation:** Complex aggregation pipelines to calculate platform statistics (total users, total contests, winner counts).
* **⚡ Optimized Querying:** Efficient database querying with sorting, pagination, and text search capabilities for contest data.
* **🔄 Status Workflow:** API endpoints to handle contest approval workflows (Pending → Approved) managed by Admins.
* **👤 User Management APIs:** Endpoints to manage user roles, update profile data, and track participation history.
* **📝 Submission Handling:** Logic to link user submissions to specific contests and allow Creators to mark them as winners.
* **🌐 CORS Configuration:** Secure Cross-Origin Resource Sharing setup to allow requests only from trusted client domains.
* **🔑 Environment Security:** Usage of `dotenv` to secure sensitive keys like DB credentials and Stripe secrets.
* **🚀 RESTful Architecture:** Clean and organized API route structure separated by controllers and services.
* **⚠️ Error Handling:** Standardized error responses and status codes for easier frontend debugging.
---
## 🛠️ **Technology Stack**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (using Native Driver)
* **Security:** JWT, Cors, Dotenv
* **Payment:** Stripe API

---

## 📡 **API Endpoints Overview**

### 🟢 **Authentication & Users**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/jwt` | Generate JWT token | Public |
| `POST` | `/users` | Create or update user | Public |
| `GET` | `/users` | Get all users | Admin |
| `GET` | `/users/role/:email` | Check user role | Private |

### 🏆 **Contests**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/contests` | Get all approved contests | Public |
| `GET` | `/contest/:id` | Get single contest details | Public |
| `POST` | `/contest` | Add a new contest | Creator |
| `PATCH` | `/contest/status/:id` | Approve/Reject contest | Admin |

### 💳 **Payments & Participation**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/contest/join` | Register for a contest | User |
| `POST` | `/user/contest/payment` | Create Stripe Session | User |
| `PATCH` | `/user/contest/payment/check`| Verify payment & update DB | User |
