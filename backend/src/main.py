
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from aiohttp import ClientSession

import uvicorn

from fastapi.middleware.cors import CORSMiddleware
from starlette.datastructures import State

from src.config import settings
from src.router.routers import router as router_crypto
from src.services.cmc import CMCHTTPClient

@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    app_instance.state = State
    app_instance.state.cmc_client = CMCHTTPClient(api_key=settings.CMC_API_KEY)
    app_instance.state.cmc_client.session = ClientSession(timeout=app_instance.state.cmc_client.timeout)
    try:
        yield
    finally:
        if app_instance.state.cmc_client and app_instance.state.cmc_client.session:
            await app_instance.state.cmc_client.session.close()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:80",
    "http://127.0.0.1",
    "http://127.0.0.1:80",
    "https://mycryptoproject.ru",
    "https://www.mycryptoproject.ru",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

app.include_router(router_crypto)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)