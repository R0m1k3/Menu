# Stage 1: Build
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install build dependencies for better-sqlite3 and bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set a dummy database URL for build time
ENV DATABASE_URL="file:./build.db"

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma Client (crucial for standalone)
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Stage 2: Runner
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies for SQLite
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy standalone build and static files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3214

# Set up entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
