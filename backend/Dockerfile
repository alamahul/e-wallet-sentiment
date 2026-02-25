FROM node:20-slim AS base

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN corepack enable

WORKDIR /app

# 1. Copy file konfigurasi workspace dari root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Copy source code backend dan database
COPY backend ./backend
COPY database ./database

# 3. Install dependensi — pnpm install di root agar virtual store tersedia
RUN pnpm install --frozen-lockfile

# 4. Generate Prisma Client
RUN pnpm run --filter=e-wallet-sentiment-database generate

# 5. Pindah ke direktori backend
WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "src/server.js"]
