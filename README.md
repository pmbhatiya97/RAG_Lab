# RAG Lab

RAG Lab is a local-first visual learning and experimentation environment for Retrieval-Augmented Generation. It turns the normally invisible RAG pipeline into an inspectable system: documents, chunks, vectors, indexes, query transformations, retrieved evidence, reranking, prompts, citations, answers and evaluation.

Instead of learning RAG from disconnected diagrams, you can change a method and immediately understand:

- What the method is
- How it processes information
- What input it receives and what output it produces
- Which downstream stages must recompute
- Where the method works well
- What can fail in production
- How quality, latency and cost change

The application runs locally on Windows, macOS or Linux. It supports Ollama, NVIDIA models and Hugging Face, with extension points for hosted providers and advanced RAG architectures.

## Why RAG Lab is useful

Large language models do not automatically know your private or newly updated documents. RAG solves this by finding relevant evidence at question time and adding it to the model prompt.

```text
Documents → Parse → Chunk → Embed → Index
                                      ↓
Question → Understand → Retrieve → Rerank → Generate → Evaluate
```

RAG Lab makes that complete evidence path visible:

```text
Answer claim → Citation → Retrieved result → Indexed chunk → Original page
```

This makes it easier to learn concepts, compare methods, debug failures and explain design decisions.

## Who should use it?

### Students

Use RAG Lab as an interactive companion for AI, NLP, information-retrieval and LLM courses.

You can:

- Follow one document through all nine RAG stages
- Understand embeddings without starting from equations alone
- Compare semantic search with BM25 keyword search
- See why chunk size and overlap affect answer quality
- Learn HNSW, IVF, product quantization and distance metrics visually
- Connect retrieval metrics to final answer quality
- Use the architecture page as a revision guide

Suggested student exercise: upload a short report, ask five questions, change Recursive chunking to Semantic chunking, and record how chunk count, retrieval results and citations change.

### Beginners

You do not need previous RAG experience. Start with the one-page architecture guide, then use the interactive lab.

Every stage explains:

- What it is
- What the current page is doing
- Why it is useful
- A worked example
- Technical implementation details
- Common failure modes

Every selectable method has a live description directly below its control. When you switch a chunker, embedder, vector database, retriever or model, the explanation changes with it.

Recommended beginner path:

1. Open `/architecture` and read the full system map.
2. Open `/lab` and follow the steps from Ingest to Evaluate.
3. Change one setting at a time and watch the downstream ripple.
4. Compare “Without RAG” and “With RAG” behavior.
5. Open `/settings` to understand providers, models and API keys.

### Advanced practitioners

Use RAG Lab to communicate architecture, evaluate tradeoffs and prototype provider adapters.

Advanced topics include:

- Recursive, semantic, parent-child, proposition and agentic chunking
- Dense, BM25, hybrid RRF, MMR, filtered and multi-vector retrieval
- Flat, HNSW, IVF, IVF-PQ, LSH, ScaNN and DiskANN indexes
- Cross-encoder, Cohere, LLM and ColBERT reranking
- Query rewriting, multi-query, HyDE, decomposition and routing
- Cache invalidation and stage-level recomputation
- Context packing, compression and lost-in-the-middle mitigation
- Retrieval and generation evaluation
- Graph RAG, SQL RAG, Self-RAG, CRAG and multimodal RAG
- Agentic Plan → Tool → Observe → Reflect → Retry workflows
- Tool policies, budgets, approvals and multi-agent roles

The backend uses plugin interfaces so additional parsers, databases, models and tools can be added without redesigning the UI.

## Application pages

| Route | Purpose |
|---|---|
| `/` | Animated RAG Lab welcome page |
| `/architecture` | Complete one-page RAG architecture and method guide |
| `/lab` | Interactive nine-stage visual RAG pipeline |
| `/settings` | Model providers, endpoints, session keys and method configuration |
| `/agentic` | Agentic RAG execution graph, tool inspector, agent roles and safety controls |
| `/api/docs` | Interactive FastAPI documentation |

## Main capabilities

- PDF, DOCX, TXT, Markdown, CSV and XLSX uploads
- Page-aware parsing and source traceability
- Eleven chunking strategies with live explanations
- Ollama, NVIDIA, Hugging Face and hosted-model choices
- Vector database and ANN index comparisons
- Query transformation and routing methods
- Dense, sparse, hybrid and diversity-aware retrieval
- Reranking and context-budget visualization
- Prompt, answer and citation tracing
- Stage-level evaluation, latency and cost concepts
- Complete Agentic RAG workbench
- Responsive product UI
- Local Windows launcher
- Docker Compose environment

## Quick start on Windows

### Prerequisites

Install:

- [Python 3.11 or newer](https://www.python.org/downloads/)
- [Node.js 22 or newer](https://nodejs.org/)

During Python installation, enable **Add Python to PATH**.

### Start the application

1. Download or clone this repository.
2. Double-click `start-rag-lab.bat`.
3. The first run creates a Python virtual environment and installs frontend and backend dependencies.
4. Two service windows open.
5. Your browser opens at [http://localhost:3000](http://localhost:3000).

Keep both service windows open while using RAG Lab.

To stop everything, double-click `stop-rag-lab.bat`.

## macOS, Linux or Git Bash

```bash
chmod +x start-rag-lab.sh
./start-rag-lab.sh
```

Then open [http://localhost:3000](http://localhost:3000).

## Manual development setup

Start the backend:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Available services:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- API documentation: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

## Using local Ollama and NVIDIA models

1. Install [Ollama](https://ollama.com/).
2. Pull a supported model using the exact model identifier available for your Ollama version.
3. Start Ollama.
4. Open RAG Lab settings.
5. Select **Ollama** and use `http://localhost:11434`.
6. Click **Test connection**.
7. Select the installed model as the generation model.

NVIDIA Nemotron-family models can be used through Ollama when supported by the chosen model package and local hardware. GPU memory requirements depend on model size and quantization.

## Using Hugging Face

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Set your token:

```env
HUGGINGFACE_TOKEN=your_token_here
```

Restart the application, open `/settings`, select Hugging Face and test the connection.

API keys entered in the browser settings page are session-only. Closing the tab clears them. Persistent keys belong in the local `.env` file or a production secret manager. Never commit `.env`.

## Example learning workflow

1. Open the Architecture page and understand the two pipelines:
   - Offline indexing
   - Online question answering
2. Upload a financial report in the Lab.
3. Inspect extracted text and page regions.
4. Compare Recursive and Semantic chunking.
5. Select NVIDIA NV-Embed or BGE-M3.
6. Compare Flat search with HNSW.
7. Ask: “How did lower inference cost affect gross margin?”
8. Compare Dense retrieval with Hybrid RRF.
9. Inspect reranking movements and final context order.
10. Open the generated citation and trace it to the source page.
11. Review faithfulness, context recall, hit rate, latency and cost.
12. Open Agentic RAG and run the same question through multiple tools.

## Project structure

```text
RAG_Lab/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Animated welcome page
│   │   ├── architecture/page.tsx    # Complete RAG architecture guide
│   │   ├── lab/page.tsx             # Interactive visual pipeline
│   │   ├── settings/page.tsx        # Providers, keys and models
│   │   ├── agentic/page.tsx         # Agentic RAG workbench
│   │   ├── method-descriptions.ts   # Explanation for every method
│   │   ├── store.ts                 # Global Zustand configuration
│   │   └── globals.css              # Product UI styles
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/routes.py            # Health, upload, chunk and model APIs
│   │   ├── core/config.py           # Environment configuration
│   │   ├── models/schemas.py        # Request and response models
│   │   ├── plugins/
│   │   │   ├── base.py              # Provider plugin interfaces
│   │   │   ├── ollama.py            # Ollama adapter
│   │   │   └── huggingface.py       # Hugging Face adapter
│   │   ├── services/documents.py    # Document extraction and chunking
│   │   └── main.py                  # FastAPI application
│   └── requirements.txt
├── start-rag-lab.bat                # Windows launcher
├── stop-rag-lab.bat                 # Windows stop helper
├── start-rag-lab.sh                 # macOS/Linux launcher
├── docker-compose.yml
└── .env.example
```

## Backend API examples

Check application health:

```bash
curl http://localhost:8000/api/health
```

Chunk text:

```bash
curl -X POST http://localhost:8000/api/chunk \
  -H "Content-Type: application/json" \
  -d '{"text":"Your document text","method":"recursive","size":256,"overlap":32}'
```

Upload a document:

```bash
curl -X POST http://localhost:8000/api/documents \
  -F "file=@report.pdf"
```

Use [http://localhost:8000/api/docs](http://localhost:8000/api/docs) for the complete interactive API reference.

## Docker

```bash
docker compose up
```

Optional services use Compose profiles:

```bash
docker compose --profile vector up
docker compose --profile gpu up
```

The GPU profile requires the NVIDIA Container Toolkit and compatible hardware.

## Privacy and security

- Local files stay local unless you select a hosted model provider.
- Browser-entered keys are stored only for the current session.
- Server keys are loaded from environment variables.
- Keys are never included in source control.
- Provider tests do not return or log credentials.
- Production tools should enforce tenant filters, read-only SQL, rate limits and explicit approval boundaries.

## Troubleshooting

### `python` or `py` is not recognized

Install Python and enable **Add Python to PATH**, then reopen the launcher.

### `npm` is not recognized

Install Node.js 22+, then restart Windows Terminal or Explorer.

### Frontend opens but says Simulation Mode

The backend is not reachable. Check that the RAG Lab API window is running on port `8000`.

### Ollama connection fails

Confirm Ollama is running and open [http://localhost:11434/api/tags](http://localhost:11434/api/tags). Then verify the endpoint on the Settings page.

### Port 3000 or 8000 is already in use

Double-click `stop-rag-lab.bat`, or stop the other application using the port, then start RAG Lab again.

### First launch is slow

The first run downloads dependencies and creates the Python environment. Future launches reuse them.

## Current implementation scope

The frontend provides the complete visual learning, configuration and Agentic RAG experience. The backend includes document extraction, basic chunking, provider checks, Ollama generation and Hugging Face adapters. Graph databases, production vector stores, SQL execution, background workers and advanced agent tools are represented as documented plugin extension points and require their production adapters before use with sensitive workloads.

## Contributing

Useful contributions include:

- New parser, chunker, embedder and vector-store plugins
- Real benchmark datasets and evaluation suites
- Additional diagrams and teaching examples
- Accessibility and localization improvements
- Production Graph RAG, SQL RAG and agent-tool adapters
- Tests for document extraction and retrieval behavior

When adding a method, also add its explanation: what it is, how it processes information, downstream impact, best use and failure risks.

## License

Add the license that matches your intended distribution before publishing or redistributing the project.
