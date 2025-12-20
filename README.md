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
