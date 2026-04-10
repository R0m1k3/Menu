#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Menu Professional Entrypoint ==="
echo "Node version: $(node -v)"
echo "Working directory: $(pwd)"

# Check permissions
echo "Checking prisma directory permissions..."
ls -ld /app/prisma
touch /app/prisma/test_write && echo "Write check: SUCCESS" && rm /app/prisma/test_write || echo "Write check: FAILED"

echo "Locating Prisma engine binary..."
find ./node_modules -name "libquery_engine*" || echo "Engine binary NOT found!"

# Run database synchronization
echo "Synchronizing database schema with Prisma..."
# Ensure DATABASE_URL is set for the CLI
export DATABASE_URL=${DATABASE_URL:-"file:/app/prisma/dev.db"}
npx prisma db push --accept-data-loss || echo "Database sync failed, but proceeding..."

# Show database file if exists
ls -l /app/prisma/dev.db || echo "Database file dev.db not yet created"

# Start the application
echo "Launching server on port ${PORT:-3214}..."
exec node server.js
