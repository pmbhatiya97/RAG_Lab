#!/usr/bin/env sh
set -eu
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$ROOT"

command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Node.js and npm are required."; exit 1; }

[ -x backend/.venv/bin/python ] || python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -q -r backend/requirements.txt
[ -d frontend/node_modules ] || npm install --prefix frontend --no-audit --no-fund

(cd backend && .venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000) &
(cd frontend && npm run dev) &

sleep 5
if command -v xdg-open >/dev/null 2>&1; then xdg-open http://localhost:3000 >/dev/null 2>&1 || true; fi
if command -v open >/dev/null 2>&1; then open http://localhost:3000 || true; fi
echo "RAG Lab is running at http://localhost:3000"
wait
