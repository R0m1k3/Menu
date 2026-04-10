#!/bin/sh
set -e

echo "=== Menu Professional — Starting ==="
echo "NODE_ENV:     ${NODE_ENV}"
echo "PORT:         ${PORT:-3214}"
echo "DATABASE_URL: ${DATABASE_URL}"

# Ensure the prisma directory exists and is writable
mkdir -p /app/prisma
chmod -R 777 /app/prisma

echo ""
echo "[1/2] Initializing database schema..."
node /app/scripts/init-db.mjs

echo ""
echo "[2/2] Starting Next.js server..."
exec node server.js
