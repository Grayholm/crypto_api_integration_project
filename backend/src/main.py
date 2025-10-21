# type: ignore
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from aiohttp import ClientSession

from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.router import router as router_crypto
from src.services.cmc import CMCHTTPClient

@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    app_instance.state.cmc_client = CMCHTTPClient(api_key=settings.CMC_API_KEY)
    app_instance.state.cmc_client.session = ClientSession(timeout=app_instance.state.cmc_client.timeout)
    try:
        yield
    finally:
        if app_instance.state.cmc_client and app_instance.state.cmc_client.session:
            await app_instance.state.cmc_client.session.close()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_crypto)

# dependency для ручек
def get_cmc_client(app: FastAPI = Depends()) -> CMCHTTPClient:
    return app.state.cmc_client