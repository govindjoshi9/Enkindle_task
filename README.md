# 🔄 Workflow Task App

A full-stack workflow management application built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📦 Tech Stack

| Layer     | Technology                                                                 |
|-----------|----------------------------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, React Router, TanStack Query, Zustand, React Flow |
| Backend   | Node.js, Express 5, MongoDB (Mongoose), JWT Auth, bcryptjs                 |
| Deployment| Frontend → Netlify, Backend → Render                                       |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

---

## 🖥️ Frontend Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the **root** of the project (next to `package.json`):

```env
# For local development
VITE_API_URL=http://localhost:5000/api

```

> **Note:** Vite only exposes variables prefixed with `VITE_` to the browser.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### Other frontend scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start local dev server (HMR)       |
| `npm run build`   | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint checks                  |

---

## 🛠️ Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` folder with the following variables:

```env
# MongoDB connection string (Atlas or local)
MONGODB_CONNECTION=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-db

# Server port
PORT=5000

# JWT secret key (use a long, random string in production)
JWT_SECRET=your_jwt_secret_here

# AES-256-CBC Encryption — requires 32-byte key (64 hex chars) and 16-byte IV (32 hex chars)
ENCRYPTION_KEY=your_64_char_hex_key_here
ENCRYPTION_IV=your_32_char_hex_iv_here

# Allowed frontend origin (for CORS)
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** It's already added to `.gitignore`.

### 4. Start the backend server

**Development (with auto-reload via nodemon):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The API will be available at **http://localhost:5000**

You can verify it's running by visiting: [http://localhost:5000](http://localhost:5000) — it should return `API is running...`

---

## 🌐 API Endpoints

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| POST   | `/api/auth/register`    | Register a new user      |
| POST   | `/api/auth/login`       | Login and get JWT token  |
| GET    | `/api/workflows`        | Get all workflows        |
| POST   | `/api/workflows`        | Create a new workflow    |
| PUT    | `/api/workflows/:id`    | Update a workflow        |
| DELETE | `/api/workflows/:id`    | Delete a workflow        |

---

## 📁 Project Structure

```
task/
├── backend/                  # Express API
│   ├── config/               # Database connection
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Auth middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Helper utilities
│   └── index.js              # Entry point
│
├── src/                      # React frontend
├── public/                   # Static assets
├── index.html                # HTML entry
├── vite.config.js            # Vite configuration
└── package.json              # Frontend dependencies
```

---

## 🔗 Live URLs

- **Frontend:** [https://workflow-task.netlify.app](https://workflow-task.netlify.app)
