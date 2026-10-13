# Per-repo fleet start config for nuki-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'nuki-mcp'
    BackendPort  = 11203
    FrontendPort = 11202
    HealthPath   = '/health'
    WebRoot      = 'web_sota'
    Backend = @{
        Kind          = 'uvicorn'
        UvicornTarget = 'nuki_mcp.main:app'
        SyncExtras    = @('dev')
        Env           = @{ WEB_PORT = '11203' }
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
