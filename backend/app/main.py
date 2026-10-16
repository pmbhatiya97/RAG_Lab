from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .core.config import settings

app = FastAPI(title=settings.app_name, version="0.2.0", docs_url="/api/docs")
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router)


@app.get("/")
async def root():
    return {"name": settings.app_name, "docs": "/api/docs"}
