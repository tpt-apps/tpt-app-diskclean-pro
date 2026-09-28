$exe = 'D:\Programming\1PRODUCTION\Open Source\tpt-diskview\target\release\tpt-diskview.exe'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = ('"' + $exe + '"'); CurrentDirectory = (Split-Path $exe) }
Write-Output ("WMI create ReturnValue=" + $r.ReturnValue + " PID=" + $r.ProcessId)
Start-Sleep -Seconds 16
$procs = Get-Process -Name 'tpt-diskview*' -ErrorAction SilentlyContinue
if ($procs) {
  $procs | ForEach-Object { Write-Output ("ALIVE after 16s: pid=" + $_.Id + " title='" + $_.MainWindowTitle + "'") }
} else {
  Write-Output "DEAD after 16s"
}
