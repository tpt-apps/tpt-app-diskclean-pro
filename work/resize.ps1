param([int]$TargetPid = 0, [int]$W = 1680, [int]$H = 1050)
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32Move {
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
}
"@
$proc = Get-Process -Id $TargetPid
$hwnd = $proc.MainWindowHandle
[Win32Move]::MoveWindow($hwnd, 20, 20, $W, $H, $true) | Out-Null
Start-Sleep -Milliseconds 800
Write-Output ("resized pid=" + $TargetPid + " to " + $W + "x" + $H)
