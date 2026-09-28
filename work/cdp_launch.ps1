param(
  [Parameter(Mandatory = $true)][string]$Exe
)
# Kill stale tpt app instances and their WebView2 browser processes
# (WebView2 caches browser args per user-data-dir, so a stale browser
# process would ignore the new --remote-debugging-port flag).
Get-Process -Name 'tpt-diskview*', 'tpt-pro-test', 'tpt-free-test' -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name = 'msedgewebview2.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match 'tpt-solutions|tpt-diskview|diskclean' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# WMI-spawned PowerShell (survives this session) sets the WebView2 debug flag
# and starts the exe detached, so env-var inheritance is explicit.
$inner = "`$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS='--remote-debugging-port=9222'; " +
         "Start-Process -FilePath '$Exe' -WorkingDirectory '$(Split-Path $Exe)'"
$cmdline = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "' + $inner + '"'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmdline }
Write-Output ("launcher ReturnValue=" + $r.ReturnValue)
Start-Sleep -Seconds 9
$found = $false
foreach ($n in @('tpt-diskview', 'tpt-pro-test', 'tpt-free-test')) {
  Get-Process -Name $n -ErrorAction SilentlyContinue | ForEach-Object { $found = $true; Write-Output ("APP: " + $_.Name + " pid=" + $_.Id + " title='" + $_.MainWindowTitle + "'") }
}
if (-not $found) { Write-Output "APP NOT RUNNING" }
