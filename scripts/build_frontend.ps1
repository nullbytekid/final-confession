# Build Next.js and copy into Django frontend_dist/
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend\confession"
$OutDir = Join-Path $Frontend "out"
$DestDir = Join-Path $Root "backend\frontend_dist"

Write-Host "Building Next.js frontend (static export)..."
Push-Location $Frontend

if (-not (Test-Path "node_modules")) {
    npm install
}

# Production build uses same-origin API (empty NEXT_PUBLIC_API_URL)
$env:NEXT_PUBLIC_API_URL = ""
npm run build

Pop-Location

if (-not (Test-Path $OutDir)) {
    throw "Build output not found at $OutDir"
}

Write-Host "Copying to backend\frontend_dist\..."
if (Test-Path $DestDir) {
    Remove-Item $DestDir -Recurse -Force
}
New-Item -ItemType Directory -Path $DestDir | Out-Null
Copy-Item -Path (Join-Path $OutDir "*") -Destination $DestDir -Recurse

Write-Host "Done! Start Django: cd backend && py manage.py runserver"
Write-Host "Open http://127.0.0.1:8000/"
