<div align="center">
  <img src="https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/VITE-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/TAILWIND-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/EXPRESS.JS-000000?style=for-the-badge&logo=express&logoColor=white" />
  <br/>
  <h1>Rivals_Pulse // SYSTEM.ANALYSIS.TERMINAL</h1>
  <p>A high-performance, minimalist tactical HUD for tracking Marvel Rivals player statistics.</p>
</div>

---

## 📡 Overview
**Rivals_Pulse** is a full-stack dashboard designed to extract and visualize player data from Marvel Rivals. Built with a sleek, military-grade terminal aesthetic, it provides instantaneous insights into Global Win Rates, KDA, Role Utilities, and deeply granular Combat Efficacy metrics.

The architecture is split into a lightning-fast **React/Vite frontend** and a lightweight **Node/Express backend** that handles data extraction via the `mrivals` SDK, featuring integrated in-memory caching for zero-latency lookups.

<br/>

## ✨ Key Features
*   **Tactical HUD Dashboard**: Pure black backgrounds, monospace fonts, and neon scanline overlays create an immersive terminal aesthetic.
*   **Real-Time Data Extraction**: Fetches live player stats, ranks, and match counts from the official Marvel Rivals API.
*   **Advanced Telemetry Modules**: Custom Recharts visualizations breaking down Role Utility (Damage/Healing/Tanking) and Combat Efficacy (Headshots, Accuracy, Streaks).
*   **Instant Roster Databank Filtering**: An isolated, memoized React component that allows for zero-latency, sub-string filtering of the entire 30+ operative roster without triggering top-level re-renders.
*   **Unified Production Server**: The Express backend is configured to seamlessly serve both the JSON API and the compiled React SPA asset bundle over a single port for easy, cost-effective cloud deployment.

<br/>

## 🚀 Local Development Setup

### 1. Requirements
*   Node.js (v18+)
*   Git

### 2. Installation
Clone the repository and install dependencies for both the frontend and the backend.

```bash
git clone https://github.com/CircuTron/rivalpulse.git
cd rivalpulse

# Install Backend
cd backend
npm install

# Install Frontend
cd ../frontend
npm install
```

### 3. Running the Development Servers
You will need to run the frontend and backend in two separate terminal windows.

**Terminal 1 (Backend API):**
```bash
cd backend
npm start
```
*The backend will boot up on `http://0.0.0.0:5000`.*

**Terminal 2 (Frontend UI):**
```bash
cd frontend
npm run dev
```
*The Vite development proxy is pre-configured to automatically route API requests to `127.0.0.1:5000`.*

<br/>

## ☁️ Production Deployment (All-in-One)
This repository is pre-configured for a "Split" or "All-in-One" deployment strategy. To deploy both the frontend and backend to a single Node instance (e.g., Render, Railway):

1. The cloud platform should execute the build script from the `backend` directory: `npm run build`.
2. This script automatically navigates to the frontend, installs dependencies, and compiles the raw React code into static files in `frontend/dist`.
3. The platform then executes the start command: `npm start`.
4. The Express server boots up, intercepts API requests, and serves the static `dist/index.html` file as a catch-all fallback, meaning your entire application runs smoothly on one server, on one port.

<br/>

---
<div align="center">
  <i>"Eyes open. Keep your pulse steady."</i>
</div>
