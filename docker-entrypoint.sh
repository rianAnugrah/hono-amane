#!/bin/sh
set -e

echo "[entrypoint] Running Prisma generate..."
npx prisma generate

echo "[entrypoint] Running Prisma migrate deploy..."
npx prisma migrate deploy

echo "[entrypoint] Seeding database..."
npx tsx prisma/seed.ts

echo "[entrypoint] Starting production server..."
npm run prod 