# Database - Schema and Migrations

Repositori ini menangani skema database menggunakan **Prisma 7** dan PostgreSQL.

## Struktur Folder
- `schema.prisma`: Definisi model database.
- `prisma.config.js`: Konfigurasi Prisma 7 (menggantikan direktif `url` di dalam schema).
- `migrations/`: Folder yang berisi file migrasi SQL.
- `seeds/`: Skrip untuk mengisi data awal ke database.

## Prasyarat
Pastikan file `.env` sudah dikonfigurasi dengan `DATABASE_URL` yang benar:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ewallet_sentiment"
```

## Perintah Penting

### 1. Generate Client
Gunakan ini setelah mengubah `schema.prisma` untuk memperbarui Prisma Client:
```bash
pnpm run generate
```

### 2. Migrasi Database
Untuk menerapkan migrasi yang sudah ada ke database:
```bash
pnpm run db:migrate
```

Untuk membuat migrasi baru saat ada perubahan skema:
```bash
pnpm run db:migrate:dev
```

### 3. Seeding Data
Untuk mengisi data contoh (10 data reviews) ke database:
```bash
pnpm run db:seed
```

## Catatan Teknis (Prisma 7)
Proyek ini menggunakan driver adapter `@prisma/adapter-pg` di dalam skrip seeder. Hal ini diperlukan karena Prisma 7 mengharuskan penggunaan Driver Adapter jika koneksi database dilakukan secara dinamis melalui kode (bukan langsung melalui file schema).
