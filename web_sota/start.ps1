Param([switch]$Headless)

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }
# ------------------------------

# start.ps1 for Nuki MCP (Relocated to web_sota)
$FrontendPort = 10892
$BackendPort = 10894
$ProjectRoot = Split-Path -Parent $PSScriptRoot

# Clear port squatters
Write-Host "Clearing ports $FrontendPort and $BackendPort..." -ForegroundColor Cyan
$pids = Get-NetTCPConnection -LocalPort $FrontendPort, $BackendPort -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 4 } | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $pids) {
    Write-Host "Found squatter (PID: $p). Terminating..." -ForegroundColor Red
    try { Stop-Process -Id $p -Force -ErrorAction Stop } catch { Write-Host "Warning: Could not terminate PID $p." -ForegroundColor Gray }
}

Write-Host "Starting Nuki MCP Backend..." -ForegroundColor Green
# Backend (nuki_mcp) in repo root src/; run from repo root so package resolves
$backendCmd = "Set-Location '$ProjectRoot'; uv run uvicorn nuki_mcp.main:app --host 127.0.0.1 --port $BackendPort --log-level info"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

Write-Host "Starting Nuki MCP Frontend..." -ForegroundColor Green
Set-Location $PSScriptRoot
if (-not (Test-Path "node_modules")) { npm install }
npm run dev -- --port $FrontendPort --host

