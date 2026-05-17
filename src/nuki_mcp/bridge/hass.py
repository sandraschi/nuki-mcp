import aiohttp
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger("nuki-mcp.bridge")


class HomeAssistantBridge:
    def __init__(self, url: str, token: str):
        self.url = url.rstrip("/")
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    async def call_service(
        self,
        domain: str,
        service: str,
        entity_id: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Call a Home Assistant service."""
        payload = data or {}
        payload["entity_id"] = entity_id

        async with aiohttp.ClientSession(headers=self.headers) as session:
            async with session.post(
                f"{self.url}/api/services/{domain}/{service}", json=payload
            ) as response:
                if response.status == 200:
                    logger.info(
                        f"Successfully called {domain}.{service} for {entity_id}"
                    )
                    return True
                else:
                    logger.error(
                        f"Failed to call {domain}.{service}: {response.status}"
                    )
                    return False

    async def get_state(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """Fetch the state of an entity."""
        async with aiohttp.ClientSession(headers=self.headers) as session:
            async with session.get(f"{self.url}/api/states/{entity_id}") as response:
                if response.status == 200:
                    return await response.json()
                return None
