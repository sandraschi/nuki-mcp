set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]

# Open the interactive recipe dashboard in the browser
default:
    @pwsh.exe -NoProfile -ExecutionPolicy Bypass -File ../mcp-central-docs/scripts/just-dashboard.ps1 -Path .

# ── Quality ───────────────────────────────────────────────────────────────────

# Ruff lint
lint:
    cd '{{justfile_directory()}}'
    uv run ruff check src/

# Ruff auto-fix
fix:
    cd '{{justfile_directory()}}'
    uv run ruff check --fix src/
    uv run ruff format src/

# ── Testing ───────────────────────────────────────────────────────────────────

test:
    cd '{{justfile_directory()}}'
    uv run pytest

# ── Serving ───────────────────────────────────────────────────────────────────

# Start backend (stdio)
stdio:
    cd '{{justfile_directory()}}'
    uv run python -m nuki_mcp

# Start full stack
dev:
    cd '{{justfile_directory()}}\web_sota'
    .\start.ps1

# ── Python ───────────────────────────────────────────────────────────────────

# Install all deps after clone
install:
    cd '{{justfile_directory()}}'
    uv sync
    if (Test-Path '{{justfile_directory()}}\web_sota') { Push-Location '{{justfile_directory()}}\web_sota'; npm install; Pop-Location }
    Write-Host "Install complete. Run: just install-mcp claude" -ForegroundColor Green

sync:
    cd '{{justfile_directory()}}'
    uv sync

# ── Nuki ─────────────────────────────────────────────────────────────────────

# Show lock status
lock-status entity_id="lock.front_door":
    cd '{{justfile_directory()}}'
    uv run python -c "import asyncio; from nuki_mcp.bridge.hass import HomeAssistantBridge; import os; b=HomeAssistantBridge(os.getenv('HASS_URL','http://homeassistant.local:8123'),os.getenv('HASS_TOKEN','')); import json; print(json.dumps(asyncio.run(b.get_state('{{entity_id}}')),indent=2))"

# Quick lock test
lock entity_id="lock.front_door":
    cd '{{justfile_directory()}}'
    uv run python -c "import asyncio; from nuki_mcp.bridge.hass import HomeAssistantBridge; import os; b=HomeAssistantBridge(os.getenv('HASS_URL','http://homeassistant.local:8123'),os.getenv('HASS_TOKEN','')); print(asyncio.run(b.call_service('lock','lock','{{entity_id}}')))"

# Quick unlock test
unlock entity_id="lock.front_door":
    cd '{{justfile_directory()}}'
    uv run python -c "import asyncio; from nuki_mcp.bridge.hass import HomeAssistantBridge; import os; b=HomeAssistantBridge(os.getenv('HASS_URL','http://homeassistant.local:8123'),os.getenv('HASS_TOKEN','')); print(asyncio.run(b.call_service('lock','unlock','{{entity_id}}')))"

# Buzz intercom
buzz entity_id="lock.main_door":
    cd '{{justfile_directory()}}'
    uv run python -c "import asyncio; from nuki_mcp.bridge.hass import HomeAssistantBridge; import os; b=HomeAssistantBridge(os.getenv('HASS_URL','http://homeassistant.local:8123'),os.getenv('HASS_TOKEN','')); print(asyncio.run(b.call_service('lock','open','{{entity_id}}')))"

# ── Utilities ─────────────────────────────────────────────────────────────────

mcpb-pack:
    cd '{{justfile_directory()}}'
    $ver = (Get-Content pyproject.toml | Select-String '^version = "(.*)"' | ForEach-Object { $$_.Matches.Groups[1].Value }); \
    $null = New-Item -ItemType Directory -Path dist -Force; \
    Compress-Archive -Path manifest.json, assets, src, pyproject.toml -DestinationPath "dist/nuki-mcp-v$ver.mcpb" -CompressionLevel Optimal -Force; \
    Write-Host "Created dist/nuki-mcp-v$ver.mcpb" -ForegroundColor Green

install-mcp client="print":
    .\install-mcp.ps1 '{{client}}'
