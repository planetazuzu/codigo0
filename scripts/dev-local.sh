#!/bin/bash
# Arranca backend y frontend en local (backend en segundo plano, frontend en primer plano).
# Requiere: PostgreSQL y Redis en marcha, backend/.env configurado, npm install en raíz y en backend.
# Uso: npm run dev:local  (desde la raíz del repo)

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

BACKEND_PID=""
cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "Iniciando backend en http://localhost:3000 ..."
(cd backend && npm run dev) &
BACKEND_PID=$!

sleep 3
echo "Iniciando frontend en http://localhost:8096 ..."
npm run dev
