import pytest
from unittest.mock import AsyncMock, patch
from nuki_mcp.bridge.hass import HomeAssistantBridge


@pytest.mark.asyncio
async def test_get_state_success():
    bridge = HomeAssistantBridge("http://test", "token")
    mock_response = {"state": "locked", "attributes": {"friendly_name": "Front Door"}}

    with patch("aiohttp.ClientSession.get") as mock_get:
        mock_get.return_value.__aenter__.return_value.status = 200
        mock_get.return_value.__aenter__.return_value.json = AsyncMock(
            return_value=mock_response
        )

        state = await bridge.get_state("lock.front_door")
        assert state == mock_response
        assert state["state"] == "locked"


@pytest.mark.asyncio
async def test_call_service_success():
    bridge = HomeAssistantBridge("http://test", "token")

    with patch("aiohttp.ClientSession.post") as mock_post:
        mock_post.return_value.__aenter__.return_value.status = 200

        success = await bridge.call_service("lock", "lock", "lock.front_door")
        assert success is True


@pytest.mark.asyncio
async def test_call_service_failure():
    bridge = HomeAssistantBridge("http://test", "token")

    with patch("aiohttp.ClientSession.post") as mock_post:
        mock_post.return_value.__aenter__.return_value.status = 500

        success = await bridge.call_service("lock", "lock", "lock.front_door")
        assert success is False
