$exe = 'D:\Programming\1PRODUCTION\Open Source\tpt-diskview\target\release\tpt-diskview.exe'
$out = 'D:\Programming\1PRODUCTION\Open Source\tpt-app-diskclean-pro\work'
$p = Start-Process -FilePath $exe -WorkingDirectory (Split-Path $exe) -PassThru
Start-Sleep -Seconds 3
$p.Refresh()
if (-not $p.HasExited) {
  & powershell -NoProfile -ExecutionPolicy Bypass -File "$out\shot.ps1" -TargetPid $p.Id -OutFile "$out\shot_t3.png"
}
Start-Sleep -Seconds 8
$p.Refresh()
Write-Output ("t=11s HasExited=" + $p.HasExited + " code=" + $p.ExitCode)
# check app/host crash events from the last 3 minutes
Get-WinEvent -FilterHashtable @{LogName='Application'; StartTime=(Get-Date).AddMinutes(-3)} -ErrorAction SilentlyContinue |
  Where-Object { $_.Message -match 'tpt-diskview|WebView' } |
  Select-Object -First 5 TimeCreated, Id, ProviderName |
  Format-Table -AutoSize | Out-String -Width 200
