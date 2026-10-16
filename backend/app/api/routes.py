from fastapi import APIRouter, File, HTTPException, UploadFile
from ..core.config import settings
import httpx
from ..models.schemas import ChunkRequest, ConnectorTest, GenerateRequest, PipelineConfig
from ..plugins.huggingface import HuggingFacePlugin
from ..plugins.ollama import OllamaPlugin
from ..services.documents import chunk_text, extract_document

router = APIRouter(prefix="/api")
ollama = OllamaPlugin()
huggingface = HuggingFacePlugin()


@router.get("/health")
async def health():
    return {"status": "ok", "mode": settings.app_mode, "ollama": await ollama.available()}


@router.get("/providers")
async def providers():
    models = []
    if await ollama.available():
        try:
            models = await ollama.models()
        except Exception:
            models = []
    return {"ollama": {"available": bool(models), "models": models}, "huggingface": {"configured": bool(settings.huggingface_token)}}


@router.post("/connectors/test")
async def test_connector(request: ConnectorTest):
    """Test a credential without storing or logging it."""
    provider = request.provider.lower()
    defaults = {
        "ollama": (settings.ollama_base_url, "/api/tags"),
        "huggingface": ("https://huggingface.co", "/api/whoami-v2"),
        "openai": ("https://api.openai.com", "/v1/models"),
        "anthropic": ("https://api.anthropic.com", "/v1/models"),
        "nvidia": ("https://integrate.api.nvidia.com", "/v1/models"),
        "cohere": ("https://api.cohere.com", "/v1/models"),
    }
    if provider not in defaults:
        raise HTTPException(400, "Unknown provider")
    base_url, path = defaults[provider]
    base_url = (request.base_url or base_url).rstrip("/")
    if provider != "ollama" and not request.api_key:
        raise HTTPException(400, "An API key is required")
    headers = {"Authorization": f"Bearer {request.api_key}"} if request.api_key else {}
    if provider == "anthropic":
        headers = {"x-api-key": request.api_key or "", "anthropic-version": "2023-06-01"}
    try:
        async with httpx.AsyncClient(timeout=8, follow_redirects=True) as client:
            response = await client.get(f"{base_url}{path}", headers=headers)
        if not response.is_success:
            raise HTTPException(400, f"Provider returned HTTP {response.status_code}")
        return {"ok": True, "provider": provider, "message": "Connection successful"}
    except httpx.HTTPError as error:
        raise HTTPException(502, f"Could not reach provider: {type(error).__name__}") from error


@router.post("/documents")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"File exceeds {settings.max_upload_mb} MB")
    try:
        text, pages = extract_document(file.filename or "upload", content)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error
    return {"name": file.filename, "pages": pages, "characters": len(text), "words": len(text.split()), "preview": text[:8000]}


@router.post("/chunk")
async def chunk(request: ChunkRequest):
    try:
        chunks = chunk_text(request.text, request.size, request.overlap)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error
    return {"method": request.method, "count": len(chunks), "chunks": chunks}


@router.post("/generate")
async def generate(request: GenerateRequest):
    prompt = "Use only the context. Cite sources as [1], [2].\n\n" + "\n\n".join(f"[{i+1}] {item}" for i, item in enumerate(request.context)) + f"\n\nQuestion: {request.question}"
    try:
        plugin = huggingface if request.provider == "huggingface" else ollama
        answer = await plugin.generate(prompt, request.model)
    except Exception as error:
        raise HTTPException(502, f"Model provider failed: {error}") from error
    return {"answer": answer, "provider": request.provider, "model": request.model}


@router.get("/config/default")
async def default_config():
    return PipelineConfig()
