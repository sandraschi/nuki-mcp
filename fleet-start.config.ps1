# Per-repo fleet start config for nuki-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'nuki-mcp'
    BackendPort  = 10894
    FrontendPort = 10980
    HealthPath   = '/health'
    WebRoot      = 'D:\Dev\repos\nuki-mcp\web_sota'
    Backend = @{
        Kind          = 'uvicorn'
        UvicornTarget = 'nuki_mcp.main:app'
        Env           = @{ WEB_PORT = '10894' }
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
