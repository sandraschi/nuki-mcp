param(
    [switch]$Headless,
    [switch]$BackendOnly,
    [switch]$NoBrowser
)

$FrontendPort = 10980
$BackendPort = 10894
$ProjectRoot = Split-Path -Parent $PSScriptRoot

$FleetStartPath = Join-Path $ProjectRoot "scripts\FleetStartMode.ps1"
if (-not (Test-Path -LiteralPath $FleetStartPath)) {
    Write-Host "ERROR: Missing vendored launcher helper: $FleetStartPath" -ForegroundColor Red
    exit 1
}
. $FleetStartPath
$FleetStart = Initialize-FleetStartMode @PSBoundParameters
Enter-FleetHeadlessConsole -Headless:$Headless -BackendOnly:$BackendOnly
Stop-FleetPortSquatters -Ports @($FrontendPort, $BackendPort) -Label "nuki-mcp"

Write-Host "Starting Nuki MCP Backend on port $BackendPort..." -ForegroundColor Green
$backendCmd = "Set-Location '$ProjectRoot'; uv run --project '$ProjectRoot' uvicorn nuki_mcp.main:app --host 127.0.0.1 --port $BackendPort --log-level info"
Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Normal", "-Command", $backendCmd

$healthUrl = "http://127.0.0.1:$BackendPort/health"
$attempt = 0
while ($attempt -lt 45) {
    try {
        $null = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        Write-Host "Backend ready at $healthUrl" -ForegroundColor Green
        break
    } catch {
        Start-Sleep -Seconds 2
        $attempt++
    }
}

if (-not $FleetStart.RunFrontend) {
    while ($true) { Start-Sleep -Seconds 60 }
}

Set-Location $PSScriptRoot
if (-not (Test-Path "node_modules")) { npm install }

if (-not $NoBrowser) {
    $frontendUrl = "http://127.0.0.1:$FrontendPort/"
    $pollAndOpen = "for (`$i = 0; `$i -lt 60; `$i++) { try { `$null = Invoke-WebRequest -Uri '$frontendUrl' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop; Start-Process '$frontendUrl'; exit } catch { Start-Sleep -Seconds 1 } }"
    Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Hidden", "-Command", $pollAndOpen
}

Write-Host "Starting Nuki MCP Frontend on port $FrontendPort..." -ForegroundColor Green
npm run dev -- --port $FrontendPort --host

