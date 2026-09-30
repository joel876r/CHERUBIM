@echo off
setlocal
echo ========================================================
echo   CHERUBIM - Pushing to GitHub (origin main)
echo ========================================================
set "PATH=C:\Users\acer\tools\git\cmd;%PATH%"
cd /d d:\CHERUBIM

git remote -v
echo.
echo Pushing repository to GitHub...
git push -u origin main

echo.
echo ========================================================
pause
