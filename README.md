# E-Wallet Sentiment Monitoring

Sistem monitoring sentimen pengguna e-wallet berbasis review Google Play Store.

## Architecture

| Layer | Tech Stack | Folder |
|-------|-----------|--------|
| Frontend | React / Next.js | /frontend |
| Backend | Express.js | /backend |
| AI/DS | Python (scikit-learn, etc.) | /ai |
| Database | PostgreSQL + Prisma | /database |
| DevOps | Docker, GitHub Actions | /infra |

## Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| prod | Production-ready | Production |
| main | Staging/UAT | Staging |
| dev | Development integration | Dev server |

### Branch Naming Convention
- feat/fe-<feature> -- Frontend feature
- feat/be-<feature> -- Backend feature
- feat/ai-<feature> -- AI/DS feature
- feat/devops-<feature> -- DevOps/Infra
- fix/<area>-<bug> -- Bug fixes
- hotfix/<name> -- Emergency production fix

## Getting Started

### Frontend
cd frontend && npm install && npm run dev

### Backend
cd backend && npm install && npm run dev

### AI
cd ai && pip install -r requirements.txt

## Team

| Role | Area | Branch Prefix |
|------|------|--------------|
| Frontend | /frontend | feat/fe-* |
| Backend | /backend, /database | feat/be-* |
| AI/DS | /ai | feat/ai-* |
| DevOps | /infra, /.github | feat/devops-* |
