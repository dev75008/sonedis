param(
  [string]$SiteRoot = 'https://sonedis.com/wp-content/uploads/2025/12',
  [string]$Ffmpeg = 'ffmpeg'
)

$ErrorActionPreference = 'Stop'
$photos = @(
  @{ Source = '20240216_055051-scaled-e1765190867597.jpg'; Name = 'distribution' },
  @{ Source = '20240308_135534-scaled-e1765962046733.jpg'; Name = 'presentation' },
  @{ Source = '20240613_111320-2-scaled.jpg'; Name = 'vitrine' },
  @{ Source = 'IMG-20230909-WA0012.jpg'; Name = 'palmier-dattier' },
  @{ Source = 'IMG-20230927-WA0003.jpg'; Name = 'palmeraie' },
  @{ Source = 'IMG-20240220-WA0019.jpg'; Name = 'rayon-produits' },
  @{ Source = 'IMG-20240508-WA0001.jpg'; Name = 'etal-dattes' },
  @{ Source = 'IMG-20241129-WA0043.jpg'; Name = 'distribution-dattes' },
  @{ Source = 'IMG-20241213-WA0070.jpg'; Name = 'dattes-branchees' },
  @{ Source = 'IMG-20250508-WA0090.jpg'; Name = 'recolte' }
)

$photoDir = Join-Path $PSScriptRoot '..\public\assets\gallery'
$outputDir = Join-Path $PSScriptRoot '..\public\assets\photos'
New-Item -ItemType Directory -Force -Path $photoDir, $outputDir | Out-Null

foreach ($photo in $photos) {
  $source = Join-Path $photoDir $photo.Source
  if (-not (Test-Path -LiteralPath $source)) {
    Invoke-WebRequest -Uri "$SiteRoot/$($photo.Source)" -OutFile $source -TimeoutSec 30
  }
  foreach ($width in @(480, 960, 1440)) {
    $output = Join-Path $outputDir "$($photo.Name)-$width.webp"
    & $Ffmpeg -hide_banner -loglevel error -y -i $source -vf "scale='min($width,iw)':-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 82 -compression_level 5 $output
    if ($LASTEXITCODE -ne 0) { throw "WebP conversion failed for $($photo.Source) at $width px" }
  }
}

$hero = Join-Path $PSScriptRoot '..\public\assets\products\photo-dattes-presentation.jpg'
foreach ($width in @(480, 960, 1440)) {
  $output = Join-Path $outputDir "dattes-origine-$width.webp"
  & $Ffmpeg -hide_banner -loglevel error -y -i $hero -vf "scale='min($width,iw)':-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 82 -compression_level 5 $output
  if ($LASTEXITCODE -ne 0) { throw "WebP conversion failed for hero photo at $width px" }
}

$productDir = Join-Path $PSScriptRoot '..\public\assets\products'
foreach ($source in Get-ChildItem -LiteralPath $productDir -File | Where-Object { $_.Extension -in '.jpg', '.jpeg', '.png' }) {
  foreach ($width in @(480, 900)) {
    $output = Join-Path $productDir "$($source.BaseName)-$width.webp"
    & $Ffmpeg -hide_banner -loglevel error -y -i $source.FullName -vf "scale='min($width,iw)':-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 83 -compression_level 5 $output
    if ($LASTEXITCODE -ne 0) { throw "WebP conversion failed for $($source.Name) at $width px" }
  }
}

Write-Output 'Asset optimisation complete. Review file dimensions and alt text before publishing.'
