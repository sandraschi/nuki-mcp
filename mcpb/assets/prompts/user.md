# nuki-mcp User Guide

Nuki Smart Lock control via Home Assistant Bridge. Lock/unlock doors, buzz intercoms, check battery status, and execute multi-step entry sequences from your AI agent. Designed for Stroheckgasse, Vienna, but works with any Nuki setup integrated into Home Assistant.

## Table of Contents

1. Installation
2. Home Assistant Setup
3. Tutorials (12 walkthroughs)
4. API Reference
5. Configuration Reference
6. Troubleshooting
7. FAQ

---

## Installation

### Prerequisites
- Python 3.11 or higher
- Home Assistant instance with Nuki integration configured and working
- Home Assistant Long-Lived Access Token
- `uv` package manager (install with `pip install uv`)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/sandraschi/nuki-mcp.git
cd nuki-mcp

# Create and configure .env file
# This file is in .gitignore — your secrets stay local
echo "HASS_URL=http://homeassistant.local:8123" > .env
echo "HASS_TOKEN=your_token_here" >> .env

# Install Python dependencies with uv
uv sync

# Run the MCP server in stdio mode (default — for Cursor, Claude Desktop)
uv run python -m nuki_mcp
```

### MCPB Bundle Installation (Claude Desktop)

If you have the `.mcpb` bundle, you can install it via:

```bash
mcpb install nuki-mcp-v0.1.0.mcpb
```

Then add the following to your MCP client config (Cursor, Claude Desktop, etc.):

```json
{
  "mcpServers": {
    "nuki-mcp": {
      "command": "uv",
      "args": ["run", "--directory", "/path/to/nuki-mcp", "python", "-m", "nuki_mcp"],
      "env": {
        "HASS_URL": "http://homeassistant.local:8123",
        "HASS_TOKEN": "your_long_lived_access_token"
      }
    }
  }
}
```

### Generating a Home Assistant Token

1. Open your Home Assistant web interface (default: http://homeassistant.local:8123)
2. Click your profile picture or initials in the bottom-left corner
3. Scroll down to the "Long-Lived Access Tokens" section
4. Click "Create Token"
5. Give it a descriptive name like "nuki-mcp"
6. A token string will appear — copy it immediately. It will not be shown again
7. Paste it into your `.env` file as the value for `HASS_TOKEN`

### Verifying the Installation

Run the server and check it connects to Home Assistant:

```bash
uv run python -c "from nuki_mcp.bridge.hass import HomeAssistantBridge; import asyncio, os; b = HomeAssistantBridge(os.getenv('HASS_URL'), os.getenv('HASS_TOKEN')); print(asyncio.run(b.get_state('lock.front_door')))"
```

If you see a dictionary with state and attributes, everything is working. If you see `None`, check your entity ID and token.

## Tutorials

### Tutorial 1: Check Lock Status

Query the current state of any Nuki lock to see if it is locked or unlocked, plus its battery level:

```
get_lock_status(entity_id="lock.front_door")
```

Expected response:
```json
{
  "entity_id": "lock.front_door",
  "state": "locked",
  "friendly_name": "Front Door",
  "locked": true,
  "battery_level": 92
}
```

**Usage scenario**: Morning security check — verify all doors are properly locked after the night.

### Tutorial 2: Lock and Unlock

Lock your front door:

```
set_lock_state(entity_id="lock.front_door", action="lock")
```

Response: `"Successfully sent lock command to lock.front_door"`

Unlock it:

```
set_lock_state(entity_id="lock.front_door", action="unlock")
```

**Usage scenario**: Locking up before leaving the house, or unlocking when arriving home.

### Tutorial 3: Buzz Someone In

Let a delivery person or guest into the building:

```
buzz_opener(entity_id="lock.opener_building")
```

Response: `"Successfully buzzed in via lock.opener_building"`

**Usage scenario**: The delivery driver is at the building entrance. You buzz them in from your AI assistant.

### Tutorial 4: Full Entry Sequence

When you arrive home, use the automated entry sequence that handles both building access and apartment access:

```
smart_entry_sequence(lock_id="lock.apartment_door", opener_id="lock.opener_building")
```

The sequence:
1. Buzzes the building door (opener_id) — lets you enter the building
2. Waits 2 seconds — time to walk from the entrance to the apartment door
3. Unlocks the apartment door (lock_id) — ready to enter

Response: `"Smart entry sequence completed successfully. Main door buzzed and apartment door unlocked."`

### Tutorial 5: Multi-Lock Security Sweep

Check all locks in your Home Assistant setup for a security audit:

```
get_lock_status(entity_id="lock.front_door")
get_lock_status(entity_id="lock.apartment_door")
get_lock_status(entity_id="lock.back_door")
```

Compare battery levels across all devices. If any are below 20%, recommend recharging. If any are unlocked, recommend locking.

### Tutorial 6: Nightly Lockdown

Before going to bed, lock all doors and verify:

```
# Lock all doors
set_lock_state(entity_id="lock.front_door", action="lock")
set_lock_state(entity_id="lock.back_door", action="lock")
set_lock_state(entity_id="lock.garage_door", action="lock")

# Verify all are secure
get_lock_status(entity_id="lock.front_door")
get_lock_status(entity_id="lock.back_door")
get_lock_status(entity_id="lock.garage_door")
```

### Tutorial 7: Welcome Guest Workflow

When a guest arrives:

```
# Step 1: Check that all locks are ready
get_lock_status(entity_id="lock.front_door")

# Step 2: Buzz the building intercom
buzz_opener(entity_id="lock.opener_building")

# Step 3: Unlock the apartment door after guest enters building
set_lock_state(entity_id="lock.apartment_door", action="unlock")
```

After the guest leaves:

```
set_lock_state(entity_id="lock.apartment_door", action="lock")
```

### Tutorial 8: Pre-Vacation Lockdown

Before a trip, secure every entry point:

```
# Check all locks
get_lock_status(entity_id="lock.front_door")
get_lock_status(entity_id="lock.back_door")
get_lock_status(entity_id="lock.garage_door")
get_lock_status(entity_id="lock.side_gate")
get_lock_status(entity_id="lock.main_gate")

# Lock any that are unlocked
set_lock_state(entity_id="lock.front_door", action="lock")
set_lock_state(entity_id="lock.back_door", action="lock")
set_lock_state(entity_id="lock.garage_door", action="lock")
set_lock_state(entity_id="lock.side_gate", action="lock")
set_lock_state(entity_id="lock.main_gate", action="lock")

# Final verification sweep
get_lock_status(entity_id="lock.front_door")
get_lock_status(entity_id="lock.back_door")
```

### Tutorial 9: Battery Health Monitoring

Periodic maintenance check:

```
# Check all lock batteries
get_lock_status(entity_id="lock.front_door")
get_lock_status(entity_id="lock.back_door")
get_lock_status(entity_id="lock.garage_door")
get_lock_status(entity_id="lock.apartment_door")
get_lock_status(entity_id="lock.opener_building")
```

If any battery_level is below 20%, recommend charging. If below 10%, the device may stop functioning soon.

### Tutorial 10: Re-Lock After Accidental Unlock

If a door was accidentally left unlocked:

```
# Check status
get_lock_status(entity_id="lock.front_door")
# If locked: false
set_lock_state(entity_id="lock.front_door", action="lock")
# Confirm
get_lock_status(entity_id="lock.front_door")
```

### Tutorial 11: Office Access Workflow

Start the work day:

```
set_lock_state(entity_id="lock.office_door", action="unlock")
```

End the work day:

```
set_lock_state(entity_id="lock.office_door", action="lock")
get_lock_status(entity_id="lock.office_door")
```

### Tutorial 12: Smart Arrival Assistant

Comprehensive arrival sequence with verification:

```
# Step 1: Pre-arrival check
get_lock_status(entity_id="lock.opener_building")
get_lock_status(entity_id="lock.apartment_door")

# Step 2: Execute full entry
smart_entry_sequence(lock_id="lock.apartment_door", opener_id="lock.opener_building")

# Step 3: Post-arrival verification
get_lock_status(entity_id="lock.apartment_door")
```

## API Reference

### Tools

| Tool | Parameters | Returns | Mutates |
|------|-----------|---------|---------|
| `get_lock_status` | `entity_id: str` | State dict with battery | No |
| `set_lock_state` | `entity_id: str, action: "lock"|"unlock"` | Status string | Yes |
| `buzz_opener` | `entity_id: str` | Status string | Yes |
| `smart_entry_sequence` | `lock_id: str, opener_id: str` | Status string | Yes |

### Prompt

| Prompt | Purpose |
|--------|---------|
| `nuki_security_dashboard` | Security officer persona for Nuki monitoring |

## Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HASS_URL` | Yes | `http://homeassistant.local:8123` | Home Assistant server URL with protocol and port |
| `HASS_TOKEN` | Yes | (empty) | Long-Lived Access Token from Home Assistant profile |
| `MCP_TRANSPORT` | No | `stdio` | Transport mode: `stdio`, `http`, or `streamable` |

## FAQ

**Q: How do I find my Home Assistant entity IDs for Nuki devices?**
A: In Home Assistant, go to Developer Tools > States. In the search box, type `lock.` to see all lock entities. The entity ID is the key shown on the left (e.g., `lock.front_door`).

**Q: What if buzz_opener fails even though the entity exists?**
A: The Nuki Opener must be configured as a `lock` domain entity in Home Assistant for the `lock.open` service to work. If the integration exposes it under a different domain (e.g., `cover`), the tool will fail. Check the HA Developer Tools > Services page for available services on your entity.

**Q: Can I use nuki-mcp without Home Assistant?**
A: No. The server is a bridge to Home Assistant. You need a running HA instance with the Nuki integration. The Nuki integration must be fully configured and working in HA before nuki-mcp will work.

**Q: Is the connection to Home Assistant encrypted?**
A: The server sends requests over HTTP by default. If you configure Home Assistant with HTTPS (e.g., via NGINX reverse proxy, Let's Encrypt, or HA Cloud), use `https://` in `HASS_URL` and the connection will be encrypted.

**Q: What exactly does `smart_entry_sequence` do, step by step?**
A: (1) Calls `lock.open` on the opener_id — buzzes the building intercom. (2) Waits 2 seconds for the person to open the door and enter. (3) Calls `lock.unlock` on the lock_id — unlocks the apartment door. If either step fails, the sequence stops and reports which step failed.

**Q: How do I handle multiple users or guests?**
A: The server is designed for single-user MCP use. For multi-user scenarios, each user would need their own MCP server instance with their own Home Assistant credentials.

**Q: Does the server support Nuki Keypad or Fob access codes?**
A: Not directly. The server controls lock state via Home Assistant. Any code-based access (Keypad, Fob, App) is handled by the Nuki device itself and is outside the scope of this MCP server.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "Entity not found" | Wrong entity_id | Check HA Developer Tools > States for correct lock entity ID |
| "Failed to send lock command" | HA token invalid or HA unreachable | Verify HASS_TOKEN is correct and HA is running at HASS_URL |
| "not found or unreachable" | HA integration missing | Install and configure Nuki integration in Home Assistant first |
| Connection refused | HA not running or wrong URL | Check `http://{HASS_URL}:8123` is accessible in browser |
| No response from tool | Wrong transport mode | Use stdio mode for IDE/Cursor integration, --serve for HTTP |
| Battery_level missing/null | Device doesn't report battery | Check Nuki device firmware version and HA Nuki integration version |
| Stale state data | HA polling interval | The state is as fresh as HA's last poll — typically a few seconds |
| 401 Unauthorized | Token expired or wrong | Generate a new Long-Lived Access Token in HA profile |
| Timeout errors | HA overloaded or network issue | Check HA system load and network connectivity |
| smart_entry_sequence partial failure | One of two steps failed | Check which step failed. The building may be buzzed but apartment not unlocked |

## MCP Integration with Other Servers

nuki-mcp can be combined with other MCP servers for powerful automation:

### Time-based Locking (with any clock tool)
```
# Check if it's after 10 PM
get_lock_status(entity_id="lock.front_door")
# If unlocked, lock for the night
set_lock_state(entity_id="lock.front_door", action="lock")
```

### Notification on State Change (with notifications-mcp)
```
get_lock_status(entity_id="lock.front_door")
# If battery_level < 20, send an alert
# If locked=false and it's nighttime, lock and notify
```

### Arrival Pipeline (with GPS/api tools)
```
# When arriving home:
get_lock_status(entity_id="lock.opener_building")
smart_entry_sequence(lock_id="lock.apartment_door", opener_id="lock.opener_building")
```

## HTTP Mode Deployment

```bash
# Start with HTTP mode
uv run python -m nuki_mcp --serve

# Health check
curl http://127.0.0.1:8000/health
# Returns: {"status": "ok", "service": "nuki-mcp"}

# Custom port via MCP_TRANSPORT
$env:MCP_TRANSPORT="http"; uv run python -m nuki_mcp
```

## Home Assistant Integration Setup Guide

### Step 1: Install Nuki Integration

1. In Home Assistant, go to Settings > Devices & Services > Add Integration
2. Search for "Nuki"
3. Follow the setup wizard
4. You'll need your Nuki Smart Lock's MAC address and (optionally) API token

### Step 2: Verify Entity IDs

1. Go to Developer Tools > States
2. Search for `lock.` in the filter
3. Note all lock entity IDs (e.g., `lock.front_door`, `lock.back_door`)
4. These are the entity_ids you'll use with nuki-mcp tools

### Step 3: Test Service Calls

1. Go to Developer Tools > Services
2. Search for `lock.lock`, `lock.unlock`, `lock.open`
3. Select your entity and press "Call Service"
4. Verify the lock responds correctly in the Nuki app

## Nuki Device Reference

### Nuki Smart Lock (3.0 Pro, 4th Gen, Ultra)

The Nuki Smart Lock mounts on your existing door lock and motorizes it. Features:
- **Lock/Unlock**: Motorized deadbolt operation
- **Battery**: 4x AA batteries, 4-6 month life
- **Communications**: Bluetooth + Wi-Fi (via Bridge or Smart Lock Ultra built-in)
- **Auto Lock**: Configurable auto-relock timer
- **Integration**: Home Assistant via Nuki Bridge or Smart Lock Ultra Wi-Fi

### Nuki Opener

The Nuki Opener replaces your intercom handset and adds smart control:
- **Buzz**: Electric strike activation for building entrance
- **Communications**: Bluetooth + Wi-Fi (via Bridge)
- **Battery**: Rechargeable, 6-8 month life
- **Integration**: Home Assistant via Nuki Bridge

## Troubleshooting — Extended

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "Entity not found" | Wrong entity_id | Check HA Developer Tools > States for exact entity ID |
| "Failed to send lock command" — 401 | Token invalid | Generate new token in HA Profile settings |
| "Failed to send lock command" — timeout | HA unreachable | Verify HASS_URL with `curl http://{HASS_URL}/api/` |
| "not found or unreachable" | HA integration missing | Install Nuki integration in HA first |
| buzz_opener fails | Opener not exposed as lock domain | Some integrations expose openers as `cover` domain |
| Battery_level missing | Not supported by this device | Check Nuki device firmware version |
| smart_entry_sequence partial failure | Only one step succeeded | Check which entity failed — may need manual fix |
| Intermittent failures | Wi-Fi connectivity | Ensure Nuki Bridge/Smart Lock Ultra has strong Wi-Fi |
| No response from tool | Wrong MCP transport mode | Use stdio for IDE integration, HTTP for REST API |
| Slow response (>5s) | HA or Nuki device busy | Normal during state transitions or when HA polls |
| Endpoint returns "unavailable" | Device offline | Check Nuki app for device status and troubleshoot connectivity |

## Multi-User Considerations

nuki-mcp is designed for single-agent MCP use. In multi-user scenarios:

- Each user/agent needs their own MCP server instance with their own Home Assistant credentials
- HA's REST API processes requests sequentially per session
- Concurrent lock/unlock commands from different instances are serialized by HA
- Consider HA automation rules for conflict resolution (e.g., "if already locked, ignore lock command")

## Security Notes

- Keep your `HASS_TOKEN` secret — it provides full REST API access to your Home Assistant instance
- Use a dedicated Long-Lived Access Token for nuki-mcp rather than sharing tokens between services
- The server does not persist, cache, or log authentication tokens after initialization
- `.env` files containing tokens are in `.gitignore` — verify they stay out of version control
- For production deployments, run Home Assistant behind HTTPS with a valid TLS certificate
- Consider network segmentation: run the MCP server and HA on the same trusted LAN
- The `smart_entry_sequence` tool opens your door — use it only in trusted contexts
- Revoke tokens periodically (every 6-12 months) as a security best practice
- Nuki devices log all access — review the Nuki app's activity log for unauthorized access attempts
- The `buzz_opener` and `set_lock_state` tools can be used to gain physical access — treat them as security-critical operations
