#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/frontend/confession"
OUT="$FRONTEND/out"
DEST="$ROOT/backend/frontend_dist"

echo "Building Next.js frontend (static export)..."
cd "$FRONTEND"
[ -d node_modules ] || npm install
NEXT_PUBLIC_API_URL= npm run build

echo "Copying to backend/frontend_dist/..."
rm -rf "$DEST"
mkdir -p "$DEST"
cp -r "$OUT"/* "$DEST/"

echo "Done! Start Django: cd backend && python manage.py runserver"
