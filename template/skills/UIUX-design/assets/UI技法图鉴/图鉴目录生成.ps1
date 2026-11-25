# Synchronize the small browser-readable index with the two Markdown references.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$sources = [ordered]@{ layout = '页面布局设计全景分类参考.md'; motion = '动效界面设计风格全景分类参考.md' }
$index = [ordered]@{}
foreach ($page in $sources.Keys) {
  $group = ''
  $entry = $null
  $index[$page] = @(foreach ($line in Get-Content -Encoding utf8 -LiteralPath $sources[$page]) {
    if ($line -match '^#{2,3}\s') { $entry = $null }
    if ($line -match '^## (.+)$') {
      $group = $Matches[1]
    } elseif ($line -match '^### (\d+\.\d+)\s+(.+)$') {
      $entry = [ordered]@{ id = $Matches[1]; title = $Matches[2]; group = $group; scenarios = ''; keywords = '' }
      $entry
    } elseif ($entry -and $line -match '^- \*\*(适用场景|关键词)\*\*[：:]\s*(.+)$') {
      if ($Matches[1] -eq '适用场景') { $entry.scenarios = $Matches[2] }
      else { $entry.keywords = $Matches[2] }
    }
  })
}
Set-Content -Encoding utf8 -LiteralPath '图鉴目录数据.js' -Value ('window.UI_GUIDE_INDEX = ' + ($index | ConvertTo-Json -Depth 4) + ';')
