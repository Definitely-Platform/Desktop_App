#
# Done (Definitely One) - Windows PowerShell Installer
# Usage: irm https://raw.githubusercontent.com/Definitely-Platform/Desktop_App/main/install.ps1 | iex
#

$ErrorActionPreference = "Stop"

$Repo = "Definitely-Platform/Desktop_App"
$AppName = "Done"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Done (Definitely One) - Windows Installer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n==> Fetching latest release info from GitHub..." -ForegroundColor Yellow
$ApiUrl = "https://api.github.com/repos/$Repo/releases/latest"

try {
    $Release = Invoke-RestMethod -Uri $ApiUrl -Headers @{ "User-Agent" = "PowerShell" }
    $TagName = $Release.tag_name
    Write-Host "==> Latest release: $TagName" -ForegroundColor Green

    # Find setup.exe asset
    $Asset = $Release.assets | Where-Object { $_.name -like "*_x64-setup.exe" } | Select-Object -First 1
    if (-not $Asset) {
        $Asset = $Release.assets | Where-Object { $_.name -like "*.exe" } | Select-Object -First 1
    }

    if (-not $Asset) {
        throw "Could not find a Windows .exe installer in the latest release."
    }

    $DownloadUrl = $Asset.browser_download_url
} catch {
    Write-Host "Warning: Falling back to direct URL." -ForegroundColor Yellow
    $DownloadUrl = "https://github.com/$Repo/releases/latest/download/Done_0.5.0_x64-setup.exe"
}

$TempDir = [System.IO.Path]::GetTempPath()
$InstallerPath = Join-Path $TempDir "Done-Setup.exe"

Write-Host "==> Downloading installer from: $DownloadUrl" -ForegroundColor Yellow
Invoke-WebRequest -Uri $DownloadUrl -OutFile $InstallerPath

Write-Host "`n==> Launching installer..." -ForegroundColor Green
Start-Process -FilePath $InstallerPath

Write-Host "`n✓ Done installer launched successfully!" -ForegroundColor Green
