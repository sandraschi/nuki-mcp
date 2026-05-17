# nuki-mcp

**FastMCP 3.2 server for Nuki Smart Lock control via Home Assistant Bridge.**

Built for Stroheckgasse, Vienna — buzz the main door, unlock the apartment, check battery levels, all through Home Assistant.

## Features

- `get_lock_status` — state, battery, friendly name
- `set_lock_state` — lock/unlock
- `buzz_opener` — electric strike for intercom entry
- `smart_entry_sequence` — multi-step: buzz main door → wait → unlock apartment
- `nuki_security_dashboard` — MCP prompt for security monitoring

## Quick start

```powershell
git clone https://github.com/sandraschi/nuki-mcp.git
cd nuki-mcp
just install
```

Configure `.env`:
```
HASS_URL=http://homeassistant.local:8123
HASS_TOKEN=your_long_lived_token
```

```powershell
just install-mcp claude
```

## Tools

| Tool | What it does |
|------|-------------|
| `get_lock_status` | Check lock state, battery, attributes |
| `set_lock_state` | Lock or unlock a Nuki device |
| `buzz_opener` | Trigger intercom electric strike |
| `smart_entry_sequence` | Buzz main door → wait → unlock apartment |

## Just recipes

```
just lock       # Quick lock test
just unlock     # Quick unlock test
just buzz       # Buzz intercom
just lock-status # Check lock state + battery
```
