# 🏛️ Student Academic Platform (Institutional Command Center)

A high-density, AI-powered academic intelligence dashboard designed for institutional scale. This platform currently manages student records with absolute mathematical precision and real-time analytical mapping.

## 🚀 LIVE DEMO CREDENTIALS

For verification and testing purposes, use the following institutional identities:

| Role | Email Identity | Access Pin-Key | Dashboard |
| :--- | :--- | :--- | :--- |
| **Student** | `std.global.2026@aiml.edu` | `Std@Edu2026` | `/student` |
| **Staff** | `staff.global.2026@cse.edu` | `Stf@Edu2026` | `/faculty` |
| **Admin** | `adminkhariz@gmail.com` | `Sudharaajan2302` | `/admin` |

## 🚀 Core Features

- **Institutional Analytics Hub**: Real-time KPI mapping of CGPA, Institutional DNA, and Placement Readiness.
- **AI Weekly Insight Engine**: Automated pedagogical recommendations and strategic institutional forecasting.
- **Micro-Segmentation**: Advanced student clustering (High Achievers, Stable Performers, Improving, and Critical Zone) across all departments.
- **Departmental Intelligence**: Deep-dive analytics for CSE, AIML, IT, ECE, EEE, and MECH.
- **Predictive Engine**: AI-driven CGPA forecasting and student risk-probability mapping.

## 🛠️ Technology Stack

- **Frontend**: Next.js (Turbopack Enabled), TailwindCSS, Chart.js, Lucide Icons.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy Core, SQLite (WAL Enabled).
- **Security**: JWT State Management, Institutional Auth logic.
- **AI**: Gemini/OpenAI integration for intelligence reports.

## 📁 Repository Structure

```text
├── client/          # Next.js Institutional Command Center (Frontend)
├── server/          # FastAPI Analytical Backend & AI Engine
├── flask_backend/   # Legacy Backend Reference
├── REPAIR_SYSTEM.bat # System Maintenance Script
├── fast_start.bat   # Local Launch Script
└── README.md        # Institutional Documentation
```

## ⚙️ Installation & Deployment

### Local Setup
1. **Launch Everything**: Run `fast_start.bat` in the root directory.
2. **Backend**: `cd server && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8001`
3. **Frontend**: `cd client && npm install && npm run dev`

### 🌐 Free & Fast Deployment Guide

To deploy this project for free:

#### 1. Backend (FastAPI) on Render.com
- Create a new **Web Service** on [Render](https://render.com).
- Connect this GitHub repository.
- **Root Directory**: `server`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `DATABASE_URL`: `sqlite:///./test.db` (Default)
  - `SECRET_KEY`: Your secret key

#### 2. Frontend (Next.js) on Vercel
- Create a new project on [Vercel](https://vercel.com).
- Connect this GitHub repository.
- **Root Directory**: `client`
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://your-api.onrender.com`)

---
*Developed for Institutional Academic Stabilization & Advanced Analytical Excellence.* 🏆🚀

