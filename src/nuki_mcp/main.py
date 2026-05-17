import asyncio
import os
import logging
from typing import Any, Dict
from fastmcp import FastMCP
from pydantic import Field
from dotenv import load_dotenv

from .bridge.hass import HomeAssistantBridge

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nuki-mcp")

# Configuration
HASS_URL = os.getenv("HASS_URL", "http://homeassistant.local:8123")
HASS_TOKEN = os.getenv("HASS_TOKEN", "")

# Initialize Bridge
bridge = HomeAssistantBridge(HASS_URL, HASS_TOKEN)

# Initialize FastMCP 3.1
mcp = FastMCP("Nuki Smart Lock")


@mcp.tool()
async def get_lock_status(
    entity_id: str = Field(
        ..., description="The Home Assistant entity ID (e.g., lock.front_door)"
    ),
) -> Dict[str, Any]:
    """Get the current state and attributes of a Nuki lock."""
    state = await bridge.get_state(entity_id)
    if not state:
        return {"error": f"Entity {entity_id} not found or unreachable"}
    return {
        "entity_id": entity_id,
        "state": state.get("state"),
        "friendly_name": state.get("attributes", {}).get("friendly_name"),
        "locked": state.get("state") == "locked",
        "battery_level": state.get("attributes", {}).get("battery_level"),
    }


@mcp.tool()
async def set_lock_state(
    entity_id: str, action: str = Field(..., pattern="^(lock|unlock)$")
) -> str:
    """Lock or unlock a Nuki device."""
    success = await bridge.call_service("lock", action, entity_id)
    if success:
        return f"Successfully sent {action} command to {entity_id}"
    return f"Failed to send {action} command to {entity_id}. Check Home Assistant logs."


@mcp.tool()
async def buzz_opener(entity_id: str) -> str:
    """Trigger the Nuki Opener electric strike (buzz-in)."""
    # Assuming the opener is a lock entity or has an 'open' service in its domain
    # Often it's lock.open or cover.open depending on HA integration
    success = await bridge.call_service("lock", "open", entity_id)
    if success:
        return f"Successfully buzzed in via {entity_id}"
    return f"Failed to buzz in via {entity_id}"


# SEP-1577 Agentic Workflow / Sampling
@mcp.tool()
async def smart_entry_sequence(lock_id: str, opener_id: str) -> str:
    """
    Execute a full entry sequence: Buzz the main building door and then unlock the apartment door.
    This demonstrates an agentic workflow for multi-stage entry.
    """
    logger.info(f"Starting smart entry sequence for {lock_id} and {opener_id}")

    # 1. Buzz the main door
    buzz_result = await bridge.call_service("lock", "open", opener_id)
    if not buzz_result:
        return f"Entry sequence failed: Could not buzz main door ({opener_id})"

    # 2. Wait for a short duration while the user enters the building (mocking logic)
    await asyncio.sleep(2)

    # 3. Unlock the apartment door
    lock_result = await bridge.call_service("lock", "unlock", lock_id)
    if not lock_result:
        return "Main door buzzed, but apartment door ({lock_id}) failed to unlock."

    return "Smart entry sequence completed successfully. Main door buzzed and apartment door unlocked."


@mcp.prompt()
def nuki_security_dashboard():
    """System prompt for an AI assistant acting as a Nuki security officer."""
    return (
        "You are the Nuki Security Assistant for Stroheckgasse. Your role is to manage building access "
        "and monitor the status of all smart locks and openers. Always verify battery levels when checking status. "
        "If a lock is state is 'unlocked' for more than 10 minutes, suggest locking it for security."
    )


# ASGI app for uvicorn (frontend proxy / HTTP transport)
app = mcp.http_app()

if __name__ == "__main__":
    mcp.run()
