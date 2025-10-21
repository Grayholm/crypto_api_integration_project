from fastapi import APIRouter, Depends
from src.services.cmc import CMCHTTPClient
from src.main import get_cmc_client

router = APIRouter(prefix="/currencies")

@router.get("/")
async def get_currencies(cmc_client: CMCHTTPClient = Depends(get_cmc_client)):
    return await cmc_client.get_listings_latest()

@router.get("/{currency_id}/quotes")
async def get_quotes_latest(currency_id: int, cmc_client: CMCHTTPClient = Depends(get_cmc_client)):
    return await cmc_client.get_quotes_latest(currency_id)