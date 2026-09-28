param(
  [Parameter(Mandatory = $true)][ValidateSet('Free', 'Pro')][string]$Edition
)
$ErrorActionPreference = 'Stop'
$repo = 'D:\Programming\1PRODUCTION\Open Source\tpt-diskview'
$builtExe = Join-Path $repo 'target\release\tpt-diskview.exe'
$stageDir = if ($Edition -eq 'Free') { Join-Path $repo 'release\TPT DiskClean Free' } else { Join-Path $repo 'release\TPT DiskClean Pro' }
$exeName = if ($Edition -eq 'Free') { 'tpt-diskclean-free.exe' } else { 'tpt-diskclean-pro.exe' }

Copy-Item $builtExe (Join-Path $stageDir $exeName) -Force
Write-Output ("staged exe: " + (Get-Item (Join-Path $stageDir $exeName)).Length + " bytes")

$zipPath = Join-Path $repo ("release\TPT-DiskClean-" + $Edition + ".zip")
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $stageDir '*') -DestinationPath $zipPath
Write-Output ("zip: " + $zipPath + " (" + (Get-Item $zipPath).Length + " bytes)")
