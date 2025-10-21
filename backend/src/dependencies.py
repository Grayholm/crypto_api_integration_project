# dependency для ручек
from fastapi import Request

from src.services.cmc import CMCHTTPClient


def get_cmc_client(request: Request) -> CMCHTTPClient:
    return request.state.cmc_client