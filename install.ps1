# Install wechat-publish skill (Windows PowerShell)
# Usage: .\install.ps1 [-Content] [-SkillsRoot <path>]
param(
  [switch]$Content,
  [string]$SkillsRoot
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Src = Join-Path $Root 'skills\wechat-publish'

if (-not $SkillsRoot) {
  if ($env:CLAUDE_SKILLS_DIR) {
    $SkillsRoot = $env:CLAUDE_SKILLS_DIR
  } else {
    $SkillsRoot = Join-Path $env:USERPROFILE '.claude\skills'
  }
}

New-Item -ItemType Directory -Force -Path $SkillsRoot | Out-Null
$Dest = Join-Path $SkillsRoot 'wechat-publish'
if (Test-Path $Dest) { Remove-Item -Recurse -Force $Dest }
Copy-Item -Recurse -Force $Src $Dest

if ($Content) {
  $cSrc = Join-Path $Root 'skills\wechat-content'
  if (Test-Path $cSrc) {
    $cDest = Join-Path $SkillsRoot 'wechat-content'
    if (Test-Path $cDest) { Remove-Item -Recurse -Force $cDest }
    Copy-Item -Recurse -Force $cSrc $cDest
    Write-Host "Installed wechat-content -> $cDest"
  }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & node (Join-Path $Dest 'scripts\convert.js') --help
  if ($LASTEXITCODE -ne 0) { throw 'CLI self-check failed' }
  Write-Host 'OK installed + CLI verified'
} else {
  Write-Host 'OK installed (warn: node not found; install Node.js >= 16)'
}

Write-Host "Skill path: $Dest"
Write-Host 'Trigger after new session: 转公众号 / 公众号排版 / wechat-publish'
