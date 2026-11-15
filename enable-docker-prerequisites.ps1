$ErrorActionPreference = 'Stop'
$log = Join-Path $PSScriptRoot 'docker-prerequisites.log'
Start-Transcript -Path $log -Force
try {
  foreach ($feature in @('VirtualMachinePlatform','Microsoft-Windows-Subsystem-Linux')) {
    $result = Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart
    Write-Output "$feature enabled; restart needed: $($result.RestartNeeded)"
  }
  Write-Output 'Prerequisites enabled. Restart Windows manually, enable SVM in BIOS, then install Docker Desktop.'
} finally { Stop-Transcript }
