#!/bin/sh
set -e

echo "=== Menu Professional Entrypoint ==="
echo "Node version: $(node -v)"
echo "DATABASE_URL: ${DATABASE_URL}"

# Ensure the prisma directory exists and is writable
mkdir -p /app/prisma
chmod -R 777 /app/prisma

echo "Write check on /app/prisma..."
touch /app/prisma/.write_test && echo "OK" && rm /app/prisma/.write_test

echo "Launching server on port ${PORT:-3214}..."
exec node server.js
