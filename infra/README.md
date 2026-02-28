# Infrastructure - Docker and Monitoring

Panduan untuk menjalankan seluruh service (database, backend, frontend) menggunakan Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose v2+
- File `.env` sudah dikonfigurasi di **root project**

## Struktur Folder

```
infra/
├── docker/
│   ├── docker-compose.yml
│   └── start.ps1            # Script untuk menjalankan Docker
└── monitoring/
```

## Konfigurasi Environment

1. Salin file `.env.example` di root project menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Sesuaikan isi `.env`:
   ```env
   # Port Configuration
   FRONTEND_PORT=3000
   BACKEND_PORT=3001
   DB_PORT=5432

   # Database Credentials
   POSTGRES_USER=admin_ewallet
   POSTGRES_PASSWORD=rahasia_super_kuat
   POSTGRES_DB=ewallet_sentiment_db
   ```

## Menjalankan Docker

1. Masuk ke folder `infra/docker`:
   ```bash
   cd infra/docker
   ```

2. Jalankan semua service:
   ```bash
   docker compose --env-file ../../.env up -d
   ```

   Atau gunakan script yang sudah disediakan:
   ```powershell
   # Windows
   ./start.ps1
   ```

3. Pastikan semua container berjalan:
   ```bash
   docker compose ps
   ```

## Services

| Service    | Container Name     | Port Default | Keterangan                  |
|------------|--------------------|--------------|-----------------------------|
| Database   | ewallet_db         | 5432         | PostgreSQL 16 Alpine        |
| Backend    | ewallet_backend    | 3001         | API Server                  |
| Frontend   | ewallet_frontend   | 3000         | Web App                     |

## Perintah Umum

```bash
# Melihat log semua service
docker compose --env-file ../../.env logs -f

# Melihat log service tertentu
docker compose --env-file ../../.env logs -f backend

# Stop semua service
docker compose --env-file ../../.env down

# Rebuild dan jalankan ulang (setelah update code)
docker compose --env-file ../../.env up -d --build

# Reset database (hapus volume)
docker compose --env-file ../../.env down -v
```

## Troubleshooting

- **Variable is not set**: Pastikan Anda menggunakan flag `--env-file ../../.env` saat menjalankan perintah docker compose.
- **Port already in use**: Ubah port di file `.env` atau stop service yang menggunakan port tersebut.
- **Build gagal**: Pastikan Anda menjalankan perintah dari folder `infra/docker/`, bukan dari root project.
