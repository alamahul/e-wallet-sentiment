# ==========================================
# TAHAP 1: BUILDER (Tukang Masak)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy file konfigurasi workspace dari root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy source code frontend
COPY frontend ./frontend

# Install dependencies untuk workspace
RUN pnpm install --frozen-lockfile

# Masuk ke direktori frontend
WORKDIR /app/frontend

# Jalankan build (menghasilkan folder dist)
RUN pnpm run build

# ==========================================
# TAHAP 2: RUNNER (Pelayan)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install package 'serve' secara global untuk menyajikan file statis
RUN npm install -g serve

# Ambil HANYA folder hasil build (dist) dari tahap builder
COPY --from=builder /app/frontend/dist ./dist

# Expose port yang digunakan (3000)
EXPOSE 3000

# Jalankan serve untuk Single Page Application (-s) di port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]