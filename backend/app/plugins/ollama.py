import httpx
from .base import EmbedderPlugin, LLMPlugin
from ..core.config import settings


class OllamaPlugin(EmbedderPlugin, LLMPlugin):
    name = "ollama"

    async def available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=2) as client:
                return (await client.get(f"{settings.ollama_base_url}/api/tags")).is_success
        except httpx.HTTPError:
            return False

    async def models(self) -> list[str]:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{settings.ollama_base_url}/api/tags")
            response.raise_for_status()
            return [item["name"] for item in response.json().get("models", [])]

    async def embed(self, texts: list[str], model: str = "nomic-embed-text") -> list[list[float]]:
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(f"{settings.ollama_base_url}/api/embed", json={"model": model, "input": texts})
            response.raise_for_status()
            return response.json()["embeddings"]

    async def generate(self, prompt: str, model: str = "nemotron-mini") -> str:
        async with httpx.AsyncClient(timeout=180) as client:
            response = await client.post(f"{settings.ollama_base_url}/api/generate", json={"model": model, "prompt": prompt, "stream": False})
            response.raise_for_status()
            return response.json()["response"]
