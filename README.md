# E-Wallet Sentiment Monitoring

Sistem monitoring sentimen pengguna e-wallet berbasis review Google Play Store.

## Architecture

| Layer | Tech Stack | Folder |
|-------|-----------|--------|
| Frontend | React | /frontend |
| Backend | Express.js | /backend |
| AI/DS | Python (scikit-learn, etc.) | /ai |
| Database | PostgreSQL + Prisma | /database |
| DevOps | Docker, GitHub Actions | /infra |

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/installation) v9+ (package manager project ini menggunakan pnpm workspace)
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose v2+ (untuk menjalankan via Docker)
- [Python](https://www.python.org/) 3.10+ (untuk AI/DS)

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd e-wallet-sentiment
pnpm install
```

### 2. Konfigurasi Environment

Salin `.env.example` menjadi `.env` di root project:
```bash
cp .env.example .env
```

Sesuaikan isi `.env`:
```env
# Port Configuration
FRONTEND_PORT=3000
BACKEND_PORT=3001
DB_PORT=5433

# Database Credentials
POSTGRES_USER=admin_ewallet
POSTGRES_PASSWORD=rahasia_super_kuat
POSTGRES_DB=ewallet_sentiment_db
```

> **Catatan**: Gunakan `DB_PORT=5433` jika di mesin lokal sudah terinstall PostgreSQL di port 5432.

### 3. Jalankan via Docker (Recommended)

Cara paling mudah untuk menjalankan semua service sekaligus:

```bash
cd infra/docker
docker compose --env-file ../../.env up -d
```

Atau gunakan script:
```powershell
# Windows
./start.ps1

# Linux/Mac
./start.sh
```

Cek status:
```bash
docker compose --env-file ../../.env ps
```

> Dokumentasi Docker lengkap ada di [`infra/README.md`](infra/README.md)

### 4. Jalankan via Lokal (per service)

#### Frontend
```bash
cd frontend
pnpm run build
pnpm run dev
```
Akses di `http://localhost:3000`

#### Backend
```bash
cd backend
pnpm run dev
```
Akses di `http://localhost:3001`

#### Database (Migration & Seed)

Pastikan PostgreSQL sudah berjalan dan `.env` sudah dikonfigurasi:
```bash
cd database

# Jalankan migration
pnpm run migrate

# Generate Prisma Client
pnpm run generate

# Jalankan seed (opsional)
pnpm run seed
```

#### AI
```bash
cd ai
pip install -r requirements.txt
```

## Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| prod | Production-ready | Production |
| main | Staging/UAT | Staging |
| dev | Development integration | Dev server |

### Branch Naming Convention

- `feat/fe-<feature>` — Frontend feature
- `feat/be-<feature>` — Backend feature
- `feat/ai-<feature>` — AI/DS feature
- `feat/devops-<feature>` — DevOps/Infra
- `fix/<area>-<bug>` — Bug fixes
- `hotfix/<name>` — Emergency production fix

## Team

| Role | Area | Branch Prefix |
|------|------|--------------|
| Frontend | /frontend | feat/fe-* |
| Backend | /backend, /database | feat/be-* |
| AI/DS | /ai | feat/ai-* |
| DevOps | /infra, /.github | feat/devops-* |

## Project Structure

```
e-wallet-sentiment/
├── frontend/          # React app
├── backend/           # Express.js API server
├── database/          # Prisma schema, migrations, seeds
├── ai/                # Python ML/AI scripts
├── infra/             # Docker, monitoring, CI/CD
│   ├── docker/
│   └── monitoring/
├── docs/              # Dokumentasi tambahan
├── .env.example       # Template environment variables
├── package.json       # Root package.json (pnpm workspace)
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```
