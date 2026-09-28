param(
  [Parameter(Mandatory = $true)][string]$InFile,
  [Parameter(Mandatory = $true)][string]$OutFile,
  [int]$Width = 1280,
  [int]$Height = 720
)
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile($InFile)
try {
  # scale to fill Width x Height, center-crop the overflow
  $scale = [Math]::Max($Width / $src.Width, $Height / $src.Height)
  $sw = [int]($src.Width * $scale)
  $sh = [int]($src.Height * $scale)
  $offX = [int](($sw - $Width) / 2)
  $offY = [Math]::Max(0, [int](($sh - $Height) / 3))  # bias crop toward the top (UI header)
  $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, (New-Object System.Drawing.Rectangle(-$offX, -$offY, $sw, $sh)))
  $g.Dispose()
  $bmp.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output ("cover: " + $OutFile)
} finally {
  $src.Dispose()
}
