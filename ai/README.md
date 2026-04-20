# 🤖 E-Wallet Sentiment Analysis - AI Module

Modul AI untuk analisis sentimen ulasan e-wallet (Dana, OVO, GoPay, dll) dari Google Play Store. Menggunakan **IndoBERT** fine-tuning untuk klasifikasi sentimen Bahasa Indonesia, **Elasticsearch** untuk penyimpanan dan pencarian vektor, serta **RAG** (Retrieval-Augmented Generation) untuk insight berbasis data.

---

## 📋 Table of Contents

- [🤖 E-Wallet Sentiment Analysis - AI Module](#-e-wallet-sentiment-analysis---ai-module)
  - [📋 Table of Contents](#-table-of-contents)
  - [🛠 Tech Stack](#-tech-stack)
  - [🏗 Pipeline Architecture](#-pipeline-architecture)
  - [📁 Project Structure](#-project-structure)
  - [🚀 Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Run Full Pipeline](#run-full-pipeline)
  - [📖 Step by Step](#-step-by-step)
  - [⚡ Make Commands](#-make-commands)
  - [🌐 API Endpoints](#-api-endpoints)
    - [Example Request](#example-request)
  - [🔧 Environment Variables](#-environment-variables)
  - [🐳 Docker](#-docker)
    - [Start All Services](#start-all-services)
    - [Build AI Only](#build-ai-only)
    - [View AI Logs](#view-ai-logs)
    - [Services Overview](#services-overview)
  - [🧪 Testing](#-testing)
  - [🔄 CI/CD Workflow](#-cicd-workflow)
    - [Branch: `dev`](#branch-dev)
    - [Branch: `main`](#branch-main)
    - [Branch: `prod`](#branch-prod)
    - [Workflow Files](#workflow-files)
  - [🚢 Deployment](#-deployment)
    - [Manual Deployment](#manual-deployment)
  - [🤝 Contributing](#-contributing)
    - [Code Style](#code-style)

---

## 🛠 Tech Stack

| Category              | Technology                                                                     |
| --------------------- | ------------------------------------------------------------------------------ |
| Language              | Python 3.11                                                                    |
| ML Framework          | PyTorch, Hugging Face Transformers                                             |
| Base Model            | [IndoBERT](https://huggingface.co/indobenchmark/indobert-base-p1) (fine-tuned) |
| NLP                   | NLTK, Sastrawi (Indonesian stemmer)                                            |
| Embeddings            | Sentence-Transformers                                                          |
| Vector Store & Search | Elasticsearch 8.12                                                             |
| RAG                   | LangChain + Elasticsearch                                                      |
| API                   | FastAPI + Uvicorn                                                              |
| Scraping              | google-play-scraper                                                            |
| Container             | Docker                                                                         |
| CI/CD                 | GitHub Actions                                                                 |
| Deployment            | Hugging Face Spaces                                                            |

---

## 🏗 Pipeline Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  1. Scraper  │────▶│  2. Storage  │────▶│ 3. Preprocessing │────▶│ 4. Training │
│  (PlayStore) │     │ (Elastic)    │     │ (Clean/Tokenize) │     │ (IndoBERT)  │
└─────────────┘     └─────────────┘     └──────────────────┘     └──────┬──────┘
                                                                        │
                    ┌─────────────┐     ┌─────────────┐                 │
                    │  6. RAG      │◀────│ 5. Embedding │◀───────────────┘
                    │  (Insight)   │     │ (Vectorize)  │
                    └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐     ┌──────────────┐     ┌─────────────┐
                    │ 7. Evaluate  │────▶│ 8. Validate   │────▶│ 9. Predict  │
                    │ (Metrics)    │     │ (Quality Gate) │     │ (Inference) │
                    └─────────────┘     └──────────────┘     └─────────────┘
```

| Step | Module                    | Description                                                            |
| ---- | ------------------------- | ---------------------------------------------------------------------- |
| 1    | `pipeline/scraper/`       | Scrape ulasan e-wallet dari Google Play Store (Dana, OVO, GoPay, dll)  |
| 2    | `pipeline/storage/`       | Simpan data mentah ke Elasticsearch untuk indexing dan retrieval       |
| 3    | `pipeline/preprocessing/` | Text cleaning, normalisasi slang Indonesia, tokenisasi, labeling       |
| 4    | `pipeline/training/`      | Fine-tune IndoBERT untuk klasifikasi sentimen (positif/negatif/netral) |
| 5    | `pipeline/embedding/`     | Generate vector embeddings dan index ke Elasticsearch                  |
| 6    | `pipeline/rag/`           | Retrieval-Augmented Generation untuk insight berbasis konteks          |
| 7    | `pipeline/evaluation/`    | Hitung accuracy, F1-score, precision, recall, confusion matrix         |
| 8    | `pipeline/validation/`    | Quality gate: pastikan model memenuhi minimum accuracy sebelum deploy  |
| 9    | `pipeline/prediction/`    | Inference endpoint untuk prediksi sentimen real-time                   |

---

## 📁 Project Structure

```
ai/
├── api/                        # FastAPI application
│   ├── main.py                 # App entry point
│   ├── routes/                 # API route handlers
│   │   ├── health.py           # GET  /health
│   │   ├── predict.py          # POST /predict
│   │   ├── rag.py              # POST /rag/query
│   │   └── scrape.py           # POST /scrape/trigger
│   ├── schemas/                # Pydantic request/response models
│   │   ├── request.py
│   │   └── response.py
│   └── middleware/              # CORS, auth, etc.
│       └── cors.py
│
├── config/                     # Centralized configuration
│   ├── settings.py             # App settings & env vars
│   ├── model_config.py         # Model hyperparameters
│   └── logging_config.py       # Logging setup
│
├── pipeline/                   # Core ML pipeline modules
│   ├── scraper/                # Step 1: Data collection
│   │   ├── playstore.py        # Google Play scraper
│   │   └── utils.py            # Helper functions
│   ├── storage/                # Step 2: Data persistence
│   │   ├── elasticsearch.py    # ES client & operations
│   │   └── schemas.py          # Index mappings
│   ├── preprocessing/          # Step 3: Data preparation
│   │   ├── cleaner.py          # Text cleaning & normalization
│   │   ├── tokenizer.py        # IndoBERT tokenization
│   │   └── augmentation.py     # Data augmentation strategies
│   ├── training/               # Step 4: Model training
│   │   ├── trainer.py          # Fine-tuning logic
│   │   ├── callbacks.py        # Training callbacks
│   │   └── hyperparams.py      # Hyperparameter configs
│   ├── embedding/              # Step 5: Vector embeddings
│   │   ├── generator.py        # Generate embeddings
│   │   ├── indexer.py          # Index to Elasticsearch
│   │   └── visualizer.py       # t-SNE / UMAP visualization
│   ├── rag/                    # Step 6: RAG pipeline
│   │   ├── retriever.py        # Retrieve relevant reviews
│   │   ├── generator.py        # Generate insights
│   │   └── chain.py            # RAG chain orchestration
│   ├── evaluation/             # Step 7: Model evaluation
│   │   ├── metrics.py          # Compute metrics
│   │   ├── reporter.py         # Generate reports
│   │   └── comparison.py       # Compare model versions
│   ├── validation/             # Step 8: Quality gates
│   │   ├── model_validator.py  # Minimum accuracy check
│   │   ├── data_validator.py   # Data quality checks
│   │   └── drift_detector.py   # Data/model drift detection
│   └── prediction/             # Step 9: Inference
│       ├── predictor.py        # Single & batch prediction
│       └── postprocessor.py    # Output formatting
│
├── scripts/                    # CLI entry points
│   ├── run_pipeline.py         # Run full pipeline end-to-end
│   ├── run_scraper.py          # Run scraper standalone
│   └── run_server.py           # Run API server
│
├── tests/                      # Unit & integration tests
│   ├── test_scraper.py
│   ├── test_preprocessing.py
│   ├── test_training.py
│   ├── test_embedding.py
│   ├── test_rag.py
│   ├── test_evaluation.py
│   ├── test_prediction.py
│   └── test_api.py
│
├── data/                       # Data directory (git-ignored)
│   ├── raw/                    # Raw scraped data
│   └── processed/              # Cleaned & tokenized data
│
├── models/                     # Trained model artifacts (git-ignored)
├── reports/                    # Evaluation reports (git-ignored)
├── notebooks/                  # Jupyter notebooks for exploration
│
├── Dockerfile                  # Container definition
├── Makefile                    # CLI shortcuts
├── requirements.txt            # Production dependencies
├── requirements-dev.txt        # Development dependencies
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Make (optional, for shortcuts)

### Setup

```bash
# From repo root, start all services (DB, ES, Backend, Frontend, AI)
cd infra/docker
docker compose --env-file ../../.env up -d --build

# Or setup AI module locally
cd ai
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

### Run Full Pipeline

```bash
cd ai
make pipeline
```

---

## 📖 Step by Step

```bash
# 1. Scrape e-wallet reviews from Google Play Store
make scrape

# 2. Preprocess: clean text, normalize slang, tokenize
make preprocess

# 3. Fine-tune IndoBERT on scraped data
make train

# 4. Generate vector embeddings for RAG
make embed

# 5. Evaluate model performance
make evaluate

# 6. Validate model meets minimum accuracy threshold
make validate

# 7. Start the API server
make serve
```

---

## ⚡ Make Commands

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `make install`    | Install production dependencies                |
| `make dev`        | Install production + dev dependencies          |
| `make scrape`     | Scrape Google Play reviews (default: Dana)     |
| `make preprocess` | Run text cleaning & tokenization               |
| `make train`      | Train model (experiment mode)                  |
| `make train-prod` | Train model (production mode, 10 epochs)       |
| `make embed`      | Generate & index vector embeddings             |
| `make evaluate`   | Compute evaluation metrics                     |
| `make validate`   | Validate model against minimum accuracy (0.85) |
| `make serve`      | Start FastAPI server with hot-reload           |
| `make pipeline`   | Run full pipeline end-to-end                   |
| `make test`       | Run all tests                                  |
| `make lint`       | Run linter (ruff)                              |
| `make clean`      | Remove generated artifacts                     |

---

## 🌐 API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint          | Description               | Request Body                                        |
| ------ | ----------------- | ------------------------- | --------------------------------------------------- |
| `GET`  | `/health`         | Health check              | -                                                   |
| `POST` | `/predict`        | Predict sentiment of text | `{"text": "aplikasi dana bagus"}`                   |
| `POST` | `/predict/batch`  | Batch prediction          | `{"texts": ["bagus", "jelek"]}`                     |
| `POST` | `/rag/query`      | RAG insight query         | `{"query": "kenapa user beri rating 1?"}`           |
| `POST` | `/scrape/trigger` | Trigger scraping job      | `{"app_id": "com.empatlavang.dana", "count": 5000}` |
| `GET`  | `/docs`           | Swagger UI documentation  | -                                                   |

### Example Request

```bash
# Health check
curl http://localhost:8000/health

# Predict sentiment
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "aplikasi Dana sangat membantu transaksi saya"}'

# Response
{
  "text": "aplikasi Dana sangat membantu transaksi saya",
  "sentiment": "positive",
  "confidence": 0.95,
  "probabilities": {
    "positive": 0.95,
    "negative": 0.03,
    "neutral": 0.02
  }
}
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable                | Default                          | Description                             |
| ----------------------- | -------------------------------- | --------------------------------------- |
| `ES_HOST`               | `http://localhost:9200`          | Elasticsearch host URL                  |
| `ES_INDEX_REVIEWS`      | `ewallet_reviews`                | ES index for raw reviews                |
| `ES_INDEX_EMBEDDINGS`   | `ewallet_embeddings`             | ES index for vector embeddings          |
| `MODEL_NAME`            | `indobenchmark/indobert-base-p1` | Hugging Face model name                 |
| `MODEL_OUTPUT_DIR`      | `./models`                       | Directory to save trained models        |
| `MAX_LENGTH`            | `256`                            | Max token length for tokenizer          |
| `BATCH_SIZE`            | `16`                             | Training batch size                     |
| `EPOCHS`                | `5`                              | Number of training epochs               |
| `LEARNING_RATE`         | `2e-5`                           | Learning rate                           |
| `API_HOST`              | `0.0.0.0`                        | API server host                         |
| `API_PORT`              | `8000`                           | API server port                         |
| `SCRAPER_DEFAULT_COUNT` | `10000`                          | Default number of reviews to scrape     |
| `HF_TOKEN`              | -                                | Hugging Face API token (for deployment) |
| `HF_SPACE_ID`           | -                                | Hugging Face Space ID                   |

---

## 🐳 Docker

AI module runs as part of the monorepo Docker stack.

### Start All Services

```bash
cd infra/docker
docker compose --env-file ../../.env up -d --build
```

### Build AI Only

```bash
cd infra/docker
docker compose --env-file ../../.env up -d --build ai
```

### View AI Logs

```bash
cd infra/docker
docker compose --env-file ../../.env logs ai -f
```

### Services Overview

| Service         | Container               | Port   | Description        |
| --------------- | ----------------------- | ------ | ------------------ |
| `db`            | `ewallet_db`            | `5432` | PostgreSQL 16      |
| `elasticsearch` | `ewallet_elasticsearch` | `9200` | Elasticsearch 8.12 |
| `backend`       | `ewallet_backend`       | `3001` | Node.js API        |
| `frontend`      | `ewallet_frontend`      | `3000` | React/Next.js      |
| `ai`            | `ewallet_ai`            | `8000` | FastAPI ML Service |

---

## 🧪 Testing

```bash
# Install dev dependencies
make dev

# Run all tests
make test

# Run specific test
python -m pytest tests/test_api.py -v

# Run with coverage
python -m pytest tests/ --cov=pipeline --cov=api --cov-report=html
```

---

## 🔄 CI/CD Workflow

The AI module uses a **3-branch strategy** with GitHub Actions:

```
dev ──────────▶ main ──────────▶ prod
 (experiment)    (staging)        (production)
```

### Branch: `dev`

- **Trigger**: Push/PR to `dev`
- **Actions**: Lint, test, train (3 epochs), metrics comment on PR

### Branch: `main`

- **Trigger**: Merge from `dev`
- **Actions**: Full training (10 epochs), evaluate, validate, build Docker image, push to GHCR

### Branch: `prod`

- **Trigger**: Merge from `main`
- **Actions**: Deploy to Hugging Face Spaces (requires manual approval)

### Workflow Files

| File                                  | Branch        | Purpose                           |
| ------------------------------------- | ------------- | --------------------------------- |
| `.github/workflows/ci-ai.yml`         | `dev`, `main` | CI: Lint, test, experiment        |
| `.github/workflows/cd-ai-staging.yml` | `main`        | Staging: Full train, Docker build |
| `.github/workflows/cd-ai-deploy.yml`  | `prod`        | Production: Deploy to HF Spaces   |

---

## 🚢 Deployment

Model is deployed to **Hugging Face Spaces** for serving. The deployment is triggered automatically when code is merged to the `prod` branch.

### Manual Deployment

```bash
# Install huggingface_hub
pip install huggingface_hub

# Login
huggingface-cli login

# Push to Space
huggingface-cli upload your-org/e-wallet-sentiment ./ai --repo-type=space
```

---

## 🤝 Contributing

1. Create a feature branch from `dev`
2. Make changes in the `ai/` directory
3. Write tests for new functionality
4. Run `make lint` and `make test`
5. Create PR to `dev` with description of changes
6. Wait for CI pipeline to pass and metrics comment
7. Request review from AI team

### Code Style

- Linter: `ruff` (line length: 120)
- Type hints: Required for all function signatures
- Docstrings: Google style
- Tests: pytest with minimum 80% coverage target
