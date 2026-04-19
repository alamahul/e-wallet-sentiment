# 🌐 E-Wallet Sentiment Analysis - Frontend

Frontend application for visualizing sentiment analysis of e-wallet reviews (Dana, OVO, GoPay, etc). Built with modern React + Vite architecture, designed for scalability and integration with AI & Backend services.

---

## 📋 Table of Contents

- [🌐 E-Wallet Sentiment Analysis - Frontend](#-e-wallet-sentiment-analysis---frontend)
  - [📋 Table of Contents](#-table-of-contents)
  - [🌐 Frontend Overview](#-frontend-overview)
  - [🛠 Tech Stack](#-tech-stack)
  - [🏗 Architecture](#-architecture)
  - [📁 Project Structure](#-project-structure)
  - [🚀 Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Run Development](#run-development)
  - [📖 Development Guide](#-development-guide)
    - [Start Dev Server](#start-dev-server)
    - [Build Production](#build-production)
    - [Preview Build](#preview-build)
  - [🌐 Routing](#-routing)
  - [🎨 Styling](#-styling)
  - [🔧 Environment Variables](#-environment-variables)
  - [🐳 Docker](#-docker)
    - [Build All Service](#build-all-service)
    - [Build Frontend Only](#build-frontend-only)
  - [🤝 Contributing](#-contributing)
  - [📌 Notes](#-notes)

---

## 🌐 Frontend Overview

This frontend serves as the **user interface** for:
- 📊 Sentiment visualization (positive, negative, neutral)
- 🔍 Insight exploration (RAG-based results)
- 📝 User interaction with AI predictions
- 📡 Integration with Backend & AI APIs

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React (Vite) |
| Language | JavaScript (JSX) |
| Routing | React Router |
| Styling | CSS / Global CSS |
| State Management | React Hooks |
| HTTP Client | Fetch / Axios |
| Build Tool | Vite |
| Linting | ESLint |
| Container | Docker |

---

## 🏗 Architecture

```
Frontend (React)
      │
      ▼
Backend API (Node.js)
      │
      ▼
AI Service (FastAPI - IndoBERT)
```

---

## 📁 Project Structure

```
frontend/
├── dist/                  # Build output
├── node_modules/          # Dependencies
├── public/                # Static assets
├── src/
│   ├── assets/            # Images/icons
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── routes/            # Routing configuration
│   ├── styles/
│   │   └── global.css     # Global styles
│   ├── utils/             # Helper functions
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   ├── App.css
│   └── index.css
│
├── .env
├── .env.example
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
└── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm / npm / yarn
- Docker (optional)

### Setup

```bash
cd frontend
pnpm install
cp .env.example .env
```

### Run Development

```bash
pnpm dev
```

App will run on:
```
http://localhost:3000
```

---

## 📖 Development Guide

### Start Dev Server
```bash
pnpm dev
```

### Build Production
```bash
pnpm build
```

### Preview Build
```bash
pnpm preview
```

---

## 🌐 Routing

Routing is handled inside:

```
src/routes/
```

Example:
- `/` → Home Page
- `/dashboard` → Sentiment Dashboard
- `/insight` → AI Insight Page

---

## 🎨 Styling

Global styling:
```
src/styles/global.css
```

Component-level styling:
```
ComponentName.css
```

---

## 🔧 Environment Variables

Copy:
```bash
cp .env.example .env
```

Example:

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |
| VITE_AI_URL | AI Service URL |

---

## 🐳 Docker

### Build All Service

```bash
docker compose --env-file ../../.env up -d --build
```

### Build Frontend Only

```bash
docker compose --env-file ../../.env up -d --build --no-deps frontend
```

## 🤝 Contributing

1. Create branch from `dev`
2. Develop feature inside `src/`
3. Run lint before commit
4. Create Pull Request

---

## 📌 Notes

- Ensure backend & AI service are running
- Update `.env` before running app
- Follow consistent component structure
