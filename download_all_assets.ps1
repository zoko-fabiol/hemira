$files = @(
  'logo-hemira-full.png',
  'logo-hemira-white.png',
  'avatar-duo.svg',
  'hemira-illustration.svg',
  'avatar-jeanne.svg',
  'avatar-miriam.svg'
)
foreach ($file in $files) {
  $url = "https://www.hemiraservices.com/assets/img/uploads/$file"
  $dest = "public/assets/img/uploads/$file"
  Write-Host "Downloading $file..."
  Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -UserAgent 'Mozilla/5.0'
}

New-Item -ItemType Directory -Path 'public/assets/js' -Force | Out-Null
Invoke-WebRequest -Uri 'https://www.hemiraservices.com/assets/js/main.js' -OutFile 'public/assets/js/main.js' -UseBasicParsing -UserAgent 'Mozilla/5.0'

New-Item -ItemType Directory -Path 'public/assets/css' -Force | Out-Null
Copy-Item 'style_live.css' 'public/assets/css/style.css' -Force
Write-Host "All assets ready!"
