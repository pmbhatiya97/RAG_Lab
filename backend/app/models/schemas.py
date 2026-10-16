from typing import Any
from pydantic import BaseModel, Field


class ChunkRequest(BaseModel):
    text: str
    method: str = "recursive"
    size: int = Field(512, ge=32, le=4096)
    overlap: int = Field(64, ge=0, le=1024)


class Chunk(BaseModel):
    id: str
    text: str
    start: int
    end: int
    metadata: dict[str, Any] = {}


class GenerateRequest(BaseModel):
    question: str
    context: list[str] = []
    provider: str = "ollama"
    model: str = "nemotron-mini"


class PipelineConfig(BaseModel):
    parser: str = "layout-aware"
    chunker: str = "recursive"
    embedder: str = "nvidia/nv-embed-v2"
    vector_db: str = "qdrant"
    index: str = "hnsw"
    retriever: str = "hybrid-rrf"
    reranker: str = "cross-encoder"
    llm: str = "ollama/nemotron-mini"
    rag_mode: str = "naive"


class ConnectorTest(BaseModel):
    provider: str
    api_key: str | None = None
    base_url: str | None = None
