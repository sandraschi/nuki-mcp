Param([switch]$Headless)

# Fast port helpers (scripts/PortHelpers.ps1)
Param([switch]$Headless)

if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }

$WebPort = 10980
$BackendPort = 10894
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Clear-Port {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 4 } | Select-Object -First 1
    if (-not $conn) { return $false }
    $targetPid = $procId
    $proc = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
    $name = if ($proc) { $proc.ProcessName } else { "PID $targetPid" }
    Write-Host "Port $Port held by $name (PID: $targetPid). Freeing..." -ForegroundColor Yellow
    try { Stop-Process -Id $targetPid -Force -ErrorAction Stop; Start-Sleep 1; return $true } catch {}
    try { taskkill /F /PID $targetPid 2>&1 | Out-Null; Start-Sleep 1; return $true } catch {}
    try { Get-CimInstance Win32_Process -Filter "ProcessId = $targetPid" -ErrorAction Stop | Invoke-CimMethod -MethodName Terminate -ErrorAction Stop | Out-Null; Start-Sleep 1; return $true } catch {}
    Write-Host "  Could not free port $Port. Run as Admin: taskkill /F /PID $targetPid" -ForegroundColor Red
    return $false
}

Write-Host "`n=== Nuki MCP ===" -ForegroundColor Cyan
Clear-Port $WebPort | Out-Null

Set-Location $ProjectRoot
if (-not (Test-Path "node_modules") -and (Test-Path "web_sota")) {
    Push-Location web_sota
    npm install
    Pop-Location
}

Write-Host "Starting backend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'uv run -m nuki_mcp' -WindowStyle $WindowStyle

Start-Sleep 3

Write-Host "Starting Vite on :$WebPort ..." -ForegroundColor Green
Set-Location (Join-Path $ProjectRoot "web_sota")
npm run dev
_PortHelpers = Join-Path $PSScriptRoot 'scripts\PortHelpers.ps1'
if (Test-Path -LiteralPath Param([switch]$Headless)

if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }

$WebPort = 10980
$BackendPort = 10894
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Clear-Port {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 4 } | Select-Object -First 1
    if (-not $conn) { return $false }
    $targetPid = $procId
    $proc = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
    $name = if ($proc) { $proc.ProcessName } else { "PID $targetPid" }
    Write-Host "Port $Port held by $name (PID: $targetPid). Freeing..." -ForegroundColor Yellow
    try { Stop-Process -Id $targetPid -Force -ErrorAction Stop; Start-Sleep 1; return $true } catch {}
    try { taskkill /F /PID $targetPid 2>&1 | Out-Null; Start-Sleep 1; return $true } catch {}
    try { Get-CimInstance Win32_Process -Filter "ProcessId = $targetPid" -ErrorAction Stop | Invoke-CimMethod -MethodName Terminate -ErrorAction Stop | Out-Null; Start-Sleep 1; return $true } catch {}
    Write-Host "  Could not free port $Port. Run as Admin: taskkill /F /PID $targetPid" -ForegroundColor Red
    return $false
}

Write-Host "`n=== Nuki MCP ===" -ForegroundColor Cyan
Clear-Port $WebPort | Out-Null

Set-Location $ProjectRoot
if (-not (Test-Path "node_modules") -and (Test-Path "web_sota")) {
    Push-Location web_sota
    npm install
    Pop-Location
}

Write-Host "Starting backend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'uv run -m nuki_mcp' -WindowStyle $WindowStyle

Start-Sleep 3

Write-Host "Starting Vite on :$WebPort ..." -ForegroundColor Green
Set-Location (Join-Path $ProjectRoot "web_sota")
npm run dev
_PortHelpers) { . Param([switch]$Headless)

if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }

$WebPort = 10980
$BackendPort = 10894
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Clear-Port {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 4 } | Select-Object -First 1
    if (-not $conn) { return $false }
    $targetPid = $procId
    $proc = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
    $name = if ($proc) { $proc.ProcessName } else { "PID $targetPid" }
    Write-Host "Port $Port held by $name (PID: $targetPid). Freeing..." -ForegroundColor Yellow
    try { Stop-Process -Id $targetPid -Force -ErrorAction Stop; Start-Sleep 1; return $true } catch {}
    try { taskkill /F /PID $targetPid 2>&1 | Out-Null; Start-Sleep 1; return $true } catch {}
    try { Get-CimInstance Win32_Process -Filter "ProcessId = $targetPid" -ErrorAction Stop | Invoke-CimMethod -MethodName Terminate -ErrorAction Stop | Out-Null; Start-Sleep 1; return $true } catch {}
    Write-Host "  Could not free port $Port. Run as Admin: taskkill /F /PID $targetPid" -ForegroundColor Red
    return $false
}

Write-Host "`n=== Nuki MCP ===" -ForegroundColor Cyan
Clear-Port $WebPort | Out-Null

Set-Location $ProjectRoot
if (-not (Test-Path "node_modules") -and (Test-Path "web_sota")) {
    Push-Location web_sota
    npm install
    Pop-Location
}

Write-Host "Starting backend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'uv run -m nuki_mcp' -WindowStyle $WindowStyle

Start-Sleep 3

Write-Host "Starting Vite on :$WebPort ..." -ForegroundColor Green
Set-Location (Join-Path $ProjectRoot "web_sota")
npm run dev
_PortHelpers }

if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }

$WebPort = 10980
$BackendPort = 10894
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Clear-Port {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 4 } | Select-Object -First 1
    if (-not $conn) { return $false }
    $targetPid = $procId
    $proc = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
    $name = if ($proc) { $proc.ProcessName } else { "PID $targetPid" }
    Write-Host "Port $Port held by $name (PID: $targetPid). Freeing..." -ForegroundColor Yellow
    try { Stop-Process -Id $targetPid -Force -ErrorAction Stop; Start-Sleep 1; return $true } catch {}
    try { taskkill /F /PID $targetPid 2>&1 | Out-Null; Start-Sleep 1; return $true } catch {}
    try { Get-CimInstance Win32_Process -Filter "ProcessId = $targetPid" -ErrorAction Stop | Invoke-CimMethod -MethodName Terminate -ErrorAction Stop | Out-Null; Start-Sleep 1; return $true } catch {}
    Write-Host "  Could not free port $Port. Run as Admin: taskkill /F /PID $targetPid" -ForegroundColor Red
    return $false
}

Write-Host "`n=== Nuki MCP ===" -ForegroundColor Cyan
Clear-Port $WebPort | Out-Null

Set-Location $ProjectRoot
if (-not (Test-Path "node_modules") -and (Test-Path "web_sota")) {
    Push-Location web_sota
    npm install
    Pop-Location
}

Write-Host "Starting backend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'uv run -m nuki_mcp' -WindowStyle $WindowStyle

Start-Sleep 3

Write-Host "Starting Vite on :$WebPort ..." -ForegroundColor Green
Set-Location (Join-Path $ProjectRoot "web_sota")
npm run dev

