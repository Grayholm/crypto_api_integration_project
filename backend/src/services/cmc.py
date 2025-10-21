from typing import Optional, Any

from aiohttp import ClientResponseError
from src.http-client import HTTPClient


class CMCHTTPClient(HTTPClient):
    def __init__(self, api_key: str, base_url: str = "https://pro-api.coinmarketcap.com/v1", timeout: int = 10):
        super().__init__(base_url=base_url, api_key=api_key, timeout=timeout)

    def _headers(self, extra: Optional[dict[str, str]] = None) -> dict[str, str]:
        headers = {
            "Accept": "application/json",
            "X-CMC_PRO_API_KEY": self.api_key,
        }
        if extra:
            headers.update(extra)
        return headers


    async def get_listings_latest(self, convert: str = "USD") -> Any:
        try:
            return await self.get("/cryptocurrency/listings/latest", params={"convert": convert})
        except ClientResponseError as e:
            print(f"Error fetching listings: {e.status} {e.message}")
            raise


    async def get_quotes_latest(self, id: int, convert: str = "USD") -> Any:
        try:
            return await self.get("/cryptocurrency/quotes/latest", params={"symbol": id, "convert": convert})
        except ClientResponseError as e:
            print(f"Error fetching quotes: {e.status} {e.message}")
            raise