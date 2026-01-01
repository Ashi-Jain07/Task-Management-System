# Task Management System

A full-stack **Task Management System** built with **Node.js, Express.js, MongoDB, React, and Tailwind CSS**.  
The application supports **role-based access control**, task assignment, filtering, and secure authentication using JWT.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Access & Refresh Tokens)

### Frontend
- React
- Tailwind CSS
- Vite

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected routes (only logged-in users can access dashboard)
- Role-based access control (`admin` and `user`)

---

### 👤 Admin Capabilities
Admin users can:
- Create tasks
- Edit task details
- Delete tasks
- View **all tasks**
- Assign tasks to users
- Update task **status**
- Update task **priority**
- Filter tasks by:
  - User
  - Priority
  - User + Priority

---

### 👥 User Capabilities
Normal users can:
- View **only their assigned tasks**
- Update **status** of their tasks
- Update **priority** of their tasks
- Filter tasks by **priority**

---

### 📋 Task Features
- Title, description, due date
- Priority: `High`, `Medium`, `Low`
- Status: `Pending`, `In-Progress`, `Completed`
- Assigned user and assigned by details
- Pagination with “Load More”
- Frontend filtering (user & priority)

---

## 🗂 Project Structure

task-management-system-backend/
task-management-system/

yaml
Copy code

---

## ⚙️ Backend Setup
```bash
git clone https://github.com/Ashi-Jain07/Task-Management-System
```

## ⚙️ Backend Setup

1. Navigate to backend folder:
```bash
cd task-management-system-backend
```

Install dependencies:

```bash
npm install
```

Create a .env file in the root of backend folder and add:
```bash
env
Copy code
PORT=3000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
```

Admin Role Setup

Set the admin email in ADMIN_EMAIL

Register a user using this email

That user will automatically get admin access

Update CORS in server.js:

```js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```
Start the backend server:

```bash
npm start
```

🎨 Frontend Setup
Navigate to frontend folder:

```bash
cd task-management-system
```

Install dependencies:

```bash
npm install
```

Create a .env file in the root of frontend folder and add:

```env
VITE_API_URL=<Backend_URL>
```
Start the frontend:

```bash
npm run dev
```

🔒 Protected Routes
/dashboard
Accessible only to authenticated users.

🧠 Role Logic Summary
Feature	Admin	User
View dashboard	✅	✅
Create task	✅	❌
Edit task	✅	❌
Delete task	✅	❌
View all tasks	✅	❌
View assigned tasks	✅	✅
Update task status	✅	✅
Update task priority	✅	✅
Filter by user	✅	❌
Filter by priority	✅	✅

📝 Notes
Pagination is implemented to improve performance.

Filtering is done on the frontend.

JWT refresh tokens are stored securely using HTTP-only cookies.

UI is built with Tailwind CSS for a clean and responsive design.

📌 Conclusion
This project demonstrates a complete role-based task management system with secure authentication, scalable backend architecture, and modern frontend UI.
