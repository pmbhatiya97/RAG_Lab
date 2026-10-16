import httpx
from .base import EmbedderPlugin, LLMPlugin
from ..core.config import settings


class HuggingFacePlugin(EmbedderPlugin, LLMPlugin):
    name = "huggingface"
    base_url = "https://router.huggingface.co"

    @property
    def headers(self) -> dict[str, str]:
        if not settings.huggingface_token:
            raise RuntimeError("Set HUGGINGFACE_TOKEN in .env")
        return {"Authorization": f"Bearer {settings.huggingface_token}"}

    async def embed(self, texts: list[str], model: str = "BAAI/bge-m3") -> list[list[float]]:
        async with httpx.AsyncClient(timeout=120, headers=self.headers) as client:
            response = await client.post(f"{self.base_url}/hf-inference/models/{model}/pipeline/feature-extraction", json={"inputs": texts})
            response.raise_for_status()
            return response.json()

    async def generate(self, prompt: str, model: str = "Qwen/Qwen2.5-7B-Instruct") -> str:
        async with httpx.AsyncClient(timeout=180, headers=self.headers) as client:
            response = await client.post(f"{self.base_url}/v1/chat/completions", json={"model": model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 800})
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
