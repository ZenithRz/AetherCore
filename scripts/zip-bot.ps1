$compress = @{
  Path = @(
    "discord-bot",
    "package.json",
    "package-lock.json"
  )
  CompressionLevel = "Optimal"
  DestinationPath = "$env:TEMP\aethrecore-bot.zip"
}
Compress-Archive @compress -Force
Write-Host "Created $env:TEMP\aethrecore-bot.zip"
