import os
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
import httpx
from pydantic import BaseModel

app = FastAPI(
    title="FastAPI + Ollama Compose Sample",
    description="Sample application integrating FastAPI with Ollama for local LLM inference.",
    version="1.0.0",
)

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "llama3.2:1b")


class GenerateRequest(BaseModel):
    prompt: str
    model: Optional[str] = None
    stream: bool = False


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    stream: bool = False


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "FastAPI + Ollama Sample",
        "ollama_host": OLLAMA_HOST,
        "default_model": DEFAULT_MODEL,
        "docs_url": "/docs",
    }


@app.get("/models")
async def list_models():
    """List all available models pulled in Ollama."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{OLLAMA_HOST}/api/tags")
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to connect to Ollama service at {OLLAMA_HOST}: {exc}",
        )


@app.post("/generate")
async def generate_text(request: GenerateRequest):
    """Generate completion from a prompt using local Ollama model."""
    model = request.model or DEFAULT_MODEL
    payload = {
        "model": model,
        "prompt": request.prompt,
        "stream": request.stream,
    }

    try:
        client = httpx.AsyncClient(timeout=120.0)
        if request.stream:

            async def stream_generator():
                async with client:
                    async with client.stream(
                        "POST", f"{OLLAMA_HOST}/api/generate", json=payload
                    ) as response:
                        async for chunk in response.aiter_bytes():
                            yield chunk

            return StreamingResponse(stream_generator(), media_type="application/x-ndjson")

        async with client:
            response = await client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.text,
                )
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Error communicating with Ollama: {exc}",
        )


@app.post("/chat")
async def chat_completion(request: ChatRequest):
    """Chat completion using local Ollama model."""
    model = request.model or DEFAULT_MODEL
    payload = {
        "model": model,
        "messages": [m.model_dump() for m in request.messages],
        "stream": request.stream,
    }

    try:
        client = httpx.AsyncClient(timeout=120.0)
        if request.stream:

            async def stream_generator():
                async with client:
                    async with client.stream(
                        "POST", f"{OLLAMA_HOST}/api/chat", json=payload
                    ) as response:
                        async for chunk in response.aiter_bytes():
                            yield chunk

            return StreamingResponse(stream_generator(), media_type="application/x-ndjson")

        async with client:
            response = await client.post(f"{OLLAMA_HOST}/api/chat", json=payload)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.text,
                )
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Error communicating with Ollama: {exc}",
        )
