param(
  [int]$TargetPid = 39980,
  [int]$MaxDepth = 12
)
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

$root = [System.Windows.Automation.AutomationElement]::RootElement
$cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, $TargetPid)
$win = $root.FindFirst([System.Windows.Automation.TreeScope]::Children, $cond)
if (-not $win) { Write-Output "WINDOW NOT FOUND for pid $TargetPid"; exit 1 }
Write-Output ("WINDOW: '" + $win.Current.Name + "' class=" + $win.Current.ClassName)

function Dump-Tree($el, $depth) {
  if ($depth -gt $MaxDepth) { return }
  $c = $el.Current
  $pad = ' ' * ($depth * 2)
  Write-Output ("{0}[{1}] '{2}' id='{3}'" -f $pad, $c.ControlType.ProgrammaticName, $c.Name, $c.AutomationId)
  $kids = $el.FindAll([System.Windows.Automation.TreeScope]::Children, [System.Windows.Automation.Condition]::TrueCondition)
  foreach ($k in $kids) { Dump-Tree $k ($depth + 1) }
}

$all = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
$main = $win.FindFirst([System.Windows.Automation.TreeScope]::Children, $all)
if (-not $main) { $main = $win }
Dump-Tree $main 0
