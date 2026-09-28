$ErrorActionPreference = 'Continue'
$exe = 'D:\Programming\1PRODUCTION\Open Source\tpt-diskview\release_stage\tpt-diskview-pro.exe'
$p = Start-Process -FilePath $exe -WorkingDirectory (Split-Path $exe) -PassThru
Start-Sleep -Seconds 8
$p.Refresh()
Write-Output ("HasExited: " + $p.HasExited)
if ($p.HasExited) {
  Write-Output ("ExitCode: " + $p.ExitCode)
} else {
  Write-Output ("PID: " + $p.Id)
  Write-Output ("MainWindowHandle: " + $p.MainWindowHandle)
  Write-Output ("MainWindowTitle: '" + $p.MainWindowTitle + "'")
}
Get-Process -Name 'tpt-diskview*' -ErrorAction SilentlyContinue | ForEach-Object { Write-Output ("PROC: " + $_.Name + " pid=" + $_.Id + " title='" + $_.MainWindowTitle + "'") }
