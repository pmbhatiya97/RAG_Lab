# RAG Lab — frontend + backend source

This is a normal local application with separate frontend and backend code. It is not tied to the hosted demo.

## Windows: double-click to run

1. Install [Python 3.11+](https://www.python.org/downloads/) and [Node.js 22+](https://nodejs.org/). During Python setup, select **Add Python to PATH**.
2. Double-click **`start-rag-lab.bat`**.
3. On the first run it creates a private Python environment and installs dependencies. Later starts are faster.
4. The app opens at `http://localhost:3000`. API documentation is at `http://localhost:8000/api/docs`.
5. Keep the two service windows open. Double-click **`stop-rag-lab.bat`** to stop both services.

For macOS/Linux/Git Bash, run `./start-rag-lab.sh`.

Pages:

- `/` — animated RAGLAB welcome screen
- `/lab` — interactive visual pipeline
- `/settings` — models, providers, endpoints, session keys, explanations and connection tests
- `/agentic` — live Agentic RAG plan/tool/observe/reflect/retry workbench with multi-agent roles, tool policy, budgets and technical guidance

Every pipeline stage includes a stage-specific learning guide below the live workspace: concept, current operation, practical benefit, worked example, input/output contract, recompute impact, technical implementation notes and common failure modes.

Every selectable method also has a live explanation directly below its control: what it is, how it processes data, what will rerun, where it fits best and what can go wrong.

## Folder structure

```text
rag-lab/
├── frontend/
│   ├── app/                    # React/Next.js UI and Zustand store
│   ├── public/                 # Static assets
│   ├── package.json
│   └── next.config.ts
├── backend/
│   ├── app/
│   │   ├── api/routes.py       # Upload, chunk, model and health endpoints
│   │   ├── core/config.py      # Environment configuration
│   │   ├── models/schemas.py   # Typed request/response models
│   │   ├── plugins/            # Ollama and Hugging Face adapters
│   │   ├── services/           # Document extraction and chunking
│   │   └── main.py             # FastAPI application
│   └── requirements.txt
├── start-rag-lab.bat           # Windows double-click launcher
├── stop-rag-lab.bat            # Windows stop helper
├── start-rag-lab.sh            # macOS/Linux/Git Bash launcher
├── docker-compose.yml
└── .env.example
```

## Ollama, NVIDIA and Hugging Face

Install [Ollama](https://ollama.com/) separately, then pull the exact model you want. The API automatically detects the models installed at `http://localhost:11434`. NVIDIA Nemotron models can be selected through Ollama when supported by your installed Ollama version and hardware.

To use Hugging Face, copy `.env.example` to `.env` and add `HUGGINGFACE_TOKEN`. Keys stay server-side and are never returned to the browser.

Supported uploads: PDF, DOCX, TXT, Markdown, CSV and XLSX. The backend includes working extraction, chunking, Ollama generation and Hugging Face generation/embedding adapters. The advanced graph, SQL, agent and managed-vector providers remain plugin extension points.

## Manual development

Backend:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

Frontend (second terminal):

```powershell
cd frontend
npm install
npm run dev
```
