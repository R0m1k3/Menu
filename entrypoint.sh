#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Menu Professional..."

# Run database synchronization
# Note: In a production environment with persistent data, 
# 'prisma db push' ensures the schema matches the code.
echo "Synchronizing database schema..."
npx prisma db push --accept-data-loss || echo "Database sync failed, but proceeding..."

# Start the application using node as Next.js is in standalone mode
echo "Launching server..."
exec node server.js
