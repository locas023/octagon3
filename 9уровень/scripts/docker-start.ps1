$ErrorActionPreference = 'Stop'
$project = Split-Path $PSScriptRoot -Parent
Push-Location $project
try {
  $dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
  $docker = if ($dockerCommand) { $dockerCommand.Source } else { Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\resources\bin\docker.exe' }
  if (!(Test-Path -LiteralPath $docker)) { throw 'Docker Desktop is not installed.' }
  if (!(Test-Path -LiteralPath '.env.compose')) {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    $password = [BitConverter]::ToString($bytes).Replace('-', '')
    @("POSTGRES_PASSWORD=$password", 'WORKFLOW_PORT=3019', 'NUXT_PUBLIC_SITE_URL=http://127.0.0.1:3019') | Set-Content -LiteralPath '.env.compose' -Encoding ASCII
  }
  & $docker compose --env-file .env.compose -p workflow-level9 up -d --build --wait --wait-timeout 120
  if ($LASTEXITCODE -ne 0) { throw 'Docker Compose failed. Review the output above.' }
  Write-Output 'WorkFlow is running. Default Docker URL: http://127.0.0.1:3019 (see WORKFLOW_PORT in .env.compose).'
} finally { Pop-Location }
