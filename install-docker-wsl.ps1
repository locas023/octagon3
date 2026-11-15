$ErrorActionPreference = 'Stop'
Start-Transcript -Path (Join-Path $PSScriptRoot 'docker-wsl-install.log') -Force
try {
  & wsl.exe --install --no-distribution --web-download
  Write-Output "WSL installer exit code: $LASTEXITCODE"
} finally { Stop-Transcript }
