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
   DB_PORT=5433

   # Database Credentials
   POSTGRES_USER=admin_ewallet
   POSTGRES_PASSWORD=rahasia_super_kuat
   POSTGRES_DB=ewallet_sentiment_db
   ```

   > **Catatan**: Gunakan `DB_PORT=5433` (atau port lain selain 5432) jika di mesin lokal sudah terinstall PostgreSQL yang menggunakan port 5432.

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
   docker compose --env-file ../../.env ps
   ```

   Semua service harus berstatus `Up`. Jika backend `Restarting`, cek log dengan perintah di bawah.

## Services

| Service    | Container Name     | Port Default | Keterangan                  |
|------------|--------------------|--------------|-----------------------------|
| Database   | ewallet_db         | 5433         | PostgreSQL 16 Alpine        |
| Backend    | ewallet_backend    | 3001         | API Server                  |
| Frontend   | ewallet_frontend   | 3000         | Web App                     |

## Database Migration

Migration Prisma **otomatis dijalankan** saat container backend start. Tidak perlu menjalankan migration secara manual.

Untuk mengecek status migration:
```bash
docker exec -it ewallet_backend sh -c "cd /app/database && npx prisma migrate status"
```

Untuk menjalankan migration manual (jika diperlukan):
```bash
docker exec -it ewallet_backend sh -c "cd /app/database && npx prisma migrate deploy"
```

Untuk menjalankan seed:
```bash
docker exec -it ewallet_backend sh -c "cd /app/database && npx prisma db seed"
```

> **Penting**: Jangan gunakan `prisma migrate dev` di dalam Docker. Gunakan `prisma migrate dev` di lokal untuk membuat migration baru, commit folder `database/migrations/`, lalu rebuild Docker.

## Koneksi ke Database

### Via Terminal
```bash
docker exec -it ewallet_db psql -U admin_ewallet -d ewallet_sentiment_db
```

Perintah berguna di dalam psql:
```sql
\dt              -- Lihat daftar tabel
\d reviews       -- Lihat struktur tabel reviews
\q               -- Keluar dari psql
```

### Via Database Client (DBeaver, pgAdmin, dll)

| Setting  | Value                  |
|----------|------------------------|
| Host     | `127.0.0.1`            |
| Port     | `5433` (sesuai DB_PORT di .env) |
| Database | `ewallet_sentiment_db` |
| Username | `admin_ewallet`        |
| Password | `rahasia_super_kuat`   |

> **Catatan**: Jika menggunakan port 5432 dan gagal connect (`password authentication failed`), kemungkinan ada PostgreSQL lokal yang sudah berjalan di port tersebut. Ganti `DB_PORT` di `.env` ke port lain (misal `5433`), lalu restart Docker.

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
docker compose --env-file ../../.env up -d
```

## Troubleshooting

### Variable is not set
Pastikan Anda menggunakan flag `--env-file ../../.env` di **setiap** perintah `docker compose`. Contoh:
```bash
# Benar
docker compose --env-file ../../.env ps

# Salah (akan warning variable not set)
docker compose ps
```

### Port already in use
Cek apakah ada service lain yang menggunakan port yang sama:
```bash
# Windows
netstat -ano | findstr :5432
```
Jika ada lebih dari satu proses, ganti `DB_PORT` di `.env` ke port lain (misal `5433`).

### Backend Restarting (crash loop)
Cek log backend untuk melihat error spesifik:
```bash
docker compose --env-file ../../.env logs backend
```

Penyebab umum:
- **Schema not found**: Pastikan folder `database/` ter-COPY di Dockerfile dan path schema benar.
- **DATABASE_URL not set**: Pastikan `docker-compose.yml` punya `DATABASE_URL` di blok `environment` backend.
- **Cannot connect to database**: Pastikan service `db` sudah `Up` sebelum backend start.

### Password authentication failed (Database Client)
Jika credentials sudah benar tapi tetap gagal connect via database client:
1. Cek apakah ada PostgreSQL lokal di port yang sama: `netstat -ano | findstr :5432`
2. Jika ada, ganti `DB_PORT` di `.env` dan restart Docker
3. Jika baru mengubah credentials, reset volume: `docker compose --env-file ../../.env down -v` lalu `up -d` lagi (PostgreSQL hanya set credentials saat pertama kali volume dibuat)

### Build gagal
Pastikan Anda menjalankan perintah dari folder `infra/docker/`, bukan dari root project.
