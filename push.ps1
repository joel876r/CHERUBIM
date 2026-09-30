$env:PATH = "C:\Users\acer\tools\git\cmd;$env:PATH"
Set-Location "d:\CHERUBIM"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CHERUBIM - Pushing to GitHub (origin main)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
git push -u origin main
Write-Host "Done!" -ForegroundColor Green
