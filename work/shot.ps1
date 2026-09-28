param(
  [int]$TargetPid = 39980,
  [string]$OutFile = "D:\Programming\1PRODUCTION\Open Source\tpt-app-diskclean-pro\work\shot.png",
  [switch]$Foreground
)
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32Shot {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdc, uint flags);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

$proc = Get-Process -Id $TargetPid -ErrorAction Stop
$hwnd = $proc.MainWindowHandle
if ($hwnd -eq [IntPtr]::Zero) { Write-Output "NO MAIN WINDOW"; exit 1 }

if ($Foreground) { [Win32Shot]::SetForegroundWindow($hwnd) | Out-Null; Start-Sleep -Milliseconds 600 }

$rect = New-Object Win32Shot+RECT
[Win32Shot]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$w = $rect.Right - $rect.Left
$h = $rect.Bottom - $rect.Top
Write-Output ("RECT: {0},{1} {2}x{3}" -f $rect.Left, $rect.Top, $w, $h)
if ($w -le 0 -or $h -le 0) { Write-Output "BAD RECT"; exit 1 }

$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$hdc = $g.GetHdc()
# PW_RENDERFULLCONTENT = 2 (captures DirectComposition/WebView2 content)
$ok = [Win32Shot]::PrintWindow($hwnd, $hdc, 2)
$g.ReleaseHdc($hdc)
$g.Dispose()
$bmp.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output ("SAVED: " + $OutFile + " printwindow=" + $ok)
