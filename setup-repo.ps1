# setup-repo.ps1
# Script untuk setup struktur repository E-Wallet Sentiment Monitoring
# Jalankan dari root folder: D:\Ngoding\e-wallet-sentiment

Write-Host "Setting up E-Wallet Sentiment Monitoring repository..." -ForegroundColor Cyan

# ============================================================
# 1. BUAT STRUKTUR FOLDER
# ============================================================
$folders = @(
    ".github\workflows",
    "frontend\src\components",
    "frontend\src\pages",
    "frontend\src\utils",
    "frontend\src\styles",
    "frontend\public",
    "backend\src\routes",
    "backend\src\controllers",
    "backend\src\middlewares",
    "backend\src\services",
    "backend\src\config",
    "backend\tests",
    "ai\src\cleaning",
    "ai\src\preprocessing",
    "ai\src\model",
    "ai\notebooks",
    "ai\data\raw",
    "ai\data\processed",
    "ai\tests",
    "database\migrations",
    "database\seeds",
    "infra\docker",
    "infra\monitoring",
    "docs"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    Write-Host "  Created: $folder" -ForegroundColor DarkGray
}

Write-Host "Folder structure created!" -ForegroundColor Green

# ============================================================
# 2. .github/CODEOWNERS
# ============================================================
$codeowners = @"
# ==============================
# CODEOWNERS - E-Wallet Sentiment
# ==============================

# Default owner (DevOps)
* @org/devops

# Frontend
/frontend/          @org/frontend-team

# Backend
/backend/           @org/backend-team

# AI / Data Science
/ai/                @org/ai-team

# Database
/database/          @org/backend-team @org/devops

# Infrastructure & CI/CD
/infra/             @org/devops
/.github/workflows/ @org/devops
"@
$codeowners | Set-Content -Path ".github\CODEOWNERS" -Encoding UTF8

Write-Host "CODEOWNERS created!" -ForegroundColor Green

# ============================================================
# 3. .github/PULL_REQUEST_TEMPLATE.md
# ============================================================
$prTemplate = @"
## Description
<!-- Jelaskan perubahan yang dilakukan -->

## Related Issue
<!-- Link ke issue terkait: closes #xxx -->

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] DevOps / CI/CD
- [ ] AI / Model update

## Area Affected
- [ ] Frontend
- [ ] Backend
- [ ] AI / Data Science
- [ ] Database
- [ ] Infrastructure

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
<!-- Tambahkan screenshot jika ada perubahan UI -->
"@
$prTemplate | Set-Content -Path ".github\PULL_REQUEST_TEMPLATE.md" -Encoding UTF8

Write-Host "PR Template created!" -ForegroundColor Green

# ============================================================
# 4. .github/workflows/ci-frontend.yml
# ============================================================
$ciFrontend = @"
name: Frontend CI

on:
  pull_request:
    paths:
      - 'frontend/**'
    branches: [dev, main]
  push:
    paths:
      - 'frontend/**'
    branches: [dev]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --passWithNoTests
      - run: npm run build
"@
$ciFrontend | Set-Content -Path ".github\workflows\ci-frontend.yml" -Encoding UTF8

# ============================================================
# 5. .github/workflows/ci-backend.yml
# ============================================================
$ciBackend = @"
name: Backend CI

on:
  pull_request:
    paths:
      - 'backend/**'
      - 'database/**'
    branches: [dev, main]
  push:
    paths:
      - 'backend/**'
    branches: [dev]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --passWithNoTests
"@
$ciBackend | Set-Content -Path ".github\workflows\ci-backend.yml" -Encoding UTF8

# ============================================================
# 6. .github/workflows/ci-ai.yml
# ============================================================
$ciAi = @"
name: AI Pipeline CI

on:
  pull_request:
    paths:
      - 'ai/**'
    branches: [dev, main]
  push:
    paths:
      - 'ai/**'
    branches: [dev]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./ai
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      - run: pip install -r requirements.txt
      - run: python -m flake8 src/ --max-line-length=120
      - run: python -m pytest tests/ -v --tb=short
"@
$ciAi | Set-Content -Path ".github\workflows\ci-ai.yml" -Encoding UTF8

# ============================================================
# 7. .github/workflows/cd-deploy.yml
# ============================================================
$cdDeploy = @"
name: CD Deploy

on:
  push:
    branches:
      - main
      - prod

jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: echo "Deploying to staging..."

  deploy-production:
    if: github.ref == 'refs/heads/prod'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: echo "Deploying to production..."
"@
$cdDeploy | Set-Content -Path ".github\workflows\cd-deploy.yml" -Encoding UTF8

Write-Host "GitHub Actions workflows created!" -ForegroundColor Green

# ============================================================
# 8. README.md
# ============================================================
$readme = @"
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
"@
$readme | Set-Content -Path "README.md" -Encoding UTF8

# ============================================================
# 9. .gitignore
# ============================================================
$gitignore = @"
# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/
venv/
env/

# Environment
.env
.env.local
.env.production

# Build
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Data (large files)
ai/data/raw/*.csv
ai/data/raw/*.json
ai/data/processed/*.csv
*.pkl
*.h5
*.pt

# Docker
docker-compose.override.yml

# Coverage
coverage/
htmlcov/
.coverage
"@
$gitignore | Set-Content -Path ".gitignore" -Encoding UTF8

Write-Host "README.md and .gitignore created!" -ForegroundColor Green

# ============================================================
# 10. FRONTEND BOILERPLATE
# ============================================================
$fePackage = '{
  "name": "e-wallet-sentiment-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  }
}'
$fePackage | Set-Content -Path "frontend\package.json" -Encoding UTF8

"# Frontend - E-Wallet Sentiment Dashboard" | Set-Content -Path "frontend\README.md" -Encoding UTF8
"export default function Home() { return <h1>E-Wallet Sentiment Dashboard</h1>; }" | Set-Content -Path "frontend\src\pages\index.jsx" -Encoding UTF8

# ============================================================
# 11. BACKEND BOILERPLATE
# ============================================================
$bePackage = '{
  "name": "e-wallet-sentiment-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "lint": "eslint src/",
    "test": "jest"
  }
}'
$bePackage | Set-Content -Path "backend\package.json" -Encoding UTF8

$beIndex = @"
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'e-wallet-sentiment-backend' });
});

app.listen(PORT, () => {
  console.log('Backend running on port ' + PORT);
});

module.exports = app;
"@
$beIndex | Set-Content -Path "backend\src\index.js" -Encoding UTF8

"# Backend - E-Wallet Sentiment API" | Set-Content -Path "backend\README.md" -Encoding UTF8

# ============================================================
# 12. AI BOILERPLATE
# ============================================================
$aiReqs = @"
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
nltk>=3.8.0
flake8>=6.0.0
pytest>=7.4.0
jupyter>=1.0.0
matplotlib>=3.7.0
seaborn>=0.12.0
wordcloud>=1.9.0
"@
$aiReqs | Set-Content -Path "ai\requirements.txt" -Encoding UTF8

$aiInit = @"
"""
E-Wallet Sentiment - AI Module
"""
"@
$aiInit | Set-Content -Path "ai\src\__init__.py" -Encoding UTF8

"" | Set-Content -Path "ai\src\cleaning\__init__.py" -Encoding UTF8
"" | Set-Content -Path "ai\src\preprocessing\__init__.py" -Encoding UTF8
"" | Set-Content -Path "ai\src\model\__init__.py" -Encoding UTF8
"" | Set-Content -Path "ai\tests\__init__.py" -Encoding UTF8

$aiTest = @"
def test_placeholder():
    assert True
"@
$aiTest | Set-Content -Path "ai\tests\test_placeholder.py" -Encoding UTF8

"# AI - Sentiment Analysis Pipeline" | Set-Content -Path "ai\README.md" -Encoding UTF8

# ============================================================
# 13. DATABASE BOILERPLATE (PRISMA)
# ============================================================
$prisma = @"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Review {
  id        Int      @id @default(autoincrement())
  appName   String   @map("app_name")
  userName  String   @map("user_name")
  content   String
  score     Int
  sentiment String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("reviews")
}

model SentimentResult {
  id         Int      @id @default(autoincrement())
  reviewId   Int      @unique @map("review_id")
  label      String
  confidence Float
  model      String   @default("default")
  createdAt  DateTime @default(now()) @map("created_at")

  @@map("sentiment_results")
}
"@
$prisma | Set-Content -Path "database\schema.prisma" -Encoding UTF8

"# Database - Schema and Migrations" | Set-Content -Path "database\README.md" -Encoding UTF8

# ============================================================
# 14. INFRA BOILERPLATE
# ============================================================
$dockerCompose = @"
version: '3.8'

services:
  frontend:
    build: ../frontend
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build: ../backend
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/ewallet_sentiment
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ewallet_sentiment
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
"@
$dockerCompose | Set-Content -Path "infra\docker\docker-compose.yml" -Encoding UTF8

"# Infrastructure - Docker and Monitoring" | Set-Content -Path "infra\README.md" -Encoding UTF8

# ============================================================
# 15. DOCS
# ============================================================
$docsReadme = @"
# Documentation

## Architecture
See root README for architecture overview.

## API Documentation
- Base URL: http://localhost:3001/api
- Health Check: GET /api/health

## Branching Guide
See root README for branching strategy.
"@
$docsReadme | Set-Content -Path "docs\README.md" -Encoding UTF8

# ============================================================
# 16. .gitkeep UNTUK FOLDER KOSONG
# ============================================================
$emptyFolders = @(
    "ai\data\raw",
    "ai\data\processed",
    "ai\notebooks",
    "database\migrations",
    "database\seeds",
    "infra\monitoring",
    "frontend\public",
    "frontend\src\components",
    "frontend\src\utils",
    "frontend\src\styles",
    "backend\src\routes",
    "backend\src\controllers",
    "backend\src\middlewares",
    "backend\src\services",
    "backend\src\config",
    "backend\tests"
)

foreach ($folder in $emptyFolders) {
    "" | Set-Content -Path "$folder\.gitkeep"
}

Write-Host "gitkeep files created!" -ForegroundColor Green

# ============================================================
# 17. GIT COMMIT & BRANCH SETUP
# ============================================================
Write-Host ""
Write-Host "Setting up Git branches..." -ForegroundColor Cyan

git add -A
git commit -m "init: project structure with monorepo setup"

git branch dev
git branch prod

Write-Host ""
Write-Host "Branches created: main, dev, prod" -ForegroundColor Green

Write-Host "Pushing all branches to remote..." -ForegroundColor Cyan
git push -u origin main
git push -u origin dev
git push -u origin prod

git checkout dev

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Structure created with all boilerplate files" -ForegroundColor White
Write-Host "Branches: prod, main, dev (currently on dev)" -ForegroundColor White
Write-Host "CI/CD workflows ready" -ForegroundColor White
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Go to GitHub repo Settings > Branches" -ForegroundColor White
Write-Host "  2. Set branch protection rules for prod, main, dev" -ForegroundColor White
Write-Host "  3. Create GitHub Teams and assign CODEOWNERS" -ForegroundColor White
Write-Host "  4. Add environment secrets for deployment" -ForegroundColor White
Write-Host ""
