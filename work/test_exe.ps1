$exe = 'D:\Programming\1PRODUCTION\Open Source\tpt-diskview\target\release\tpt-diskview.exe'
$p = Start-Process -FilePath $exe -WorkingDirectory (Split-Path $exe) -PassThru
for ($i = 0; $i -lt 10; $i++) {
  Start-Sleep -Seconds 1
  $p.Refresh()
  if ($p.HasExited) { Write-Output ("EXITED after ~" + ($i + 1) + "s code=" + $p.ExitCode); break }
  Write-Output ("t=" + ($i + 1) + "s alive, hwnd=" + $p.MainWindowHandle + " title='" + $p.MainWindowTitle + "'")
}
Get-Process -Name 'tpt-diskview*' -ErrorAction SilentlyContinue | ForEach-Object { Write-Output ("PROC: pid=" + $_.Id + " title='" + $_.MainWindowTitle + "'") }
