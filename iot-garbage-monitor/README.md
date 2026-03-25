# 🗑️ BinSense — IoT-Based Garbage Level Monitoring System

A full-stack production-ready web application for monitoring garbage bin fill levels in real time via IoT sensors.

---

## 📁 Folder Structure

```
iot-garbage-monitor/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Signup, Login, GetMe, GetWorkers
│   │   ├── binController.js    # CRUD + IoT update-level
│   │   └── workerController.js # Worker tasks + mark cleaned
│   ├── middleware/
│   │   ├── auth.js             # JWT protect, adminOnly, workerOrAdmin
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validate.js         # express-validator middleware
│   ├── models/
│   │   ├── User.js             # User schema (email, password, role)
│   │   └── Bin.js              # Bin schema (auto-computes status)
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── bins.js             # /api/bins/*
│   │   └── worker.js           # /api/worker/*
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                 # Demo data seeder
│   └── server.js               # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── DashboardLayout.jsx  # Sidebar + topbar layout
    │   │   │   └── ProtectedRoute.jsx  # Auth guard
    │   │   └── ui/
    │   │       ├── Button.jsx
    │   │       ├── Input.jsx
    │   │       ├── Select.jsx
    │   │       ├── Card.jsx
    │   │       ├── Modal.jsx
    │   │       ├── BinFormModal.jsx
    │   │       ├── ConfirmModal.jsx
    │   │       ├── StatusBadge.jsx
    │   │       ├── FillLevelBar.jsx
    │   │       ├── StatCard.jsx
    │   │       └── Skeleton.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Auth state + JWT
    │   ├── hooks/
    │   │   ├── useBins.js
    │   │   └── useWorkerTasks.js
    │   ├── pages/
    │   │   ├── Landing.jsx      # Public landing page
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminBins.jsx
    │   │   ├── WorkerDashboard.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   └── api.js           # Axios instance + API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css            # Tailwind v4 + custom tokens
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env        # Edit with your MongoDB URI + JWT secret
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure Environment

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iot-garbage-monitor
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data (Optional)

```bash
cd backend
node seed.js
```

This creates:
| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin@demo.com     | admin123   |
| Worker | worker@demo.com    | worker123  |
| Worker | priya@demo.com     | worker123  |

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev          # nodemon, port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev          # Vite, port 5173
```

Open: http://localhost:5173

---

## 🌐 API Reference

### Auth
| Method | Endpoint           | Auth     | Description        |
|--------|--------------------|----------|--------------------|
| POST   | /api/auth/signup   | None     | Register user      |
| POST   | /api/auth/login    | None     | Login + get token  |
| GET    | /api/auth/me       | Bearer   | Get current user   |
| GET    | /api/auth/workers  | Admin    | List all workers   |

### Bins
| Method | Endpoint                  | Auth     | Description           |
|--------|---------------------------|----------|-----------------------|
| GET    | /api/bins                 | Bearer   | Get all bins + stats  |
| POST   | /api/bins                 | Admin    | Create bin            |
| PUT    | /api/bins/:id             | Admin    | Update bin            |
| DELETE | /api/bins/:id             | Admin    | Soft-delete bin       |
| POST   | /api/bins/update-level    | None*    | IoT sensor update     |

*Secured by endpoint obscurity; add API key middleware for production.

### Worker
| Method | Endpoint                  | Auth     | Description           |
|--------|---------------------------|----------|-----------------------|
| GET    | /api/worker/tasks         | Worker   | Get assigned bins     |
| PUT    | /api/worker/complete/:id  | Worker   | Mark bin as cleaned   |

---

## 📡 IoT Integration

Send POST to `/api/bins/update-level`:

```json
{
  "binId": "BIN-001",
  "fillLevel": 82.5
}
```

**Arduino/ESP32 example (pseudocode):**
```cpp
HTTPClient http;
http.begin("http://your-server.com/api/bins/update-level");
http.addHeader("Content-Type", "application/json");
String body = "{\"binId\":\"BIN-001\",\"fillLevel\":" + String(distance) + "}";
int code = http.POST(body);
```

---

## 🛡️ Security Features
- bcryptjs password hashing (12 salt rounds)
- JWT with configurable expiry
- Role-based middleware (admin / worker)
- Express-validator input sanitization
- Global error handler with stack traces in dev only
- CORS restricted to frontend origin

---

## 🎨 Design System
- **Font:** DM Sans (UI) + DM Mono (IDs, numbers)
- **Primary:** Teal 600 (#0d9488)
- **Status colors:** Green (low) / Yellow (medium) / Red (full)
- **Theme:** Clean slate backgrounds, white cards, subtle borders

