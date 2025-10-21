import aiohttp
from typing import Any, Optional


class HTTPClient:
    def __init__(self, base_url: str, api_key: Optional[str] = None, timeout: int = 10):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(timeout=self.timeout)
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if self.session:
            await self.session.close()

    def _headers(self, extra: Optional[dict[str, str]] = None) -> dict[str, str]:
        headers = {"Accept": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        if extra:
            headers.update(extra)
        return headers

    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[dict[str, Any]] = None,
        json: Optional[dict[str, Any]] = None,
        headers: Optional[dict[str, str]] = None,
    ) -> Any:
        if not self.session:
            raise RuntimeError("ClientSession is not initialized.")

        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        async with self.session.request(
            method=method,
            url=url,
            params=params,
            json=json,
            headers=self._headers(headers),
        ) as response:
            response.raise_for_status()
            try:
                return await response.json()
            except aiohttp.ContentTypeError:
                return await response.text()

    async def get(self, endpoint: str, **kwargs) -> Any:
        return await self._request("GET", endpoint, **kwargs)