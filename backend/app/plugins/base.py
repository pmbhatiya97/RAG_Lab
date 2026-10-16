from abc import ABC, abstractmethod


class EmbedderPlugin(ABC):
    name: str

    @abstractmethod
    async def embed(self, texts: list[str]) -> list[list[float]]: ...


class LLMPlugin(ABC):
    name: str

    @abstractmethod
    async def generate(self, prompt: str, model: str) -> str: ...
