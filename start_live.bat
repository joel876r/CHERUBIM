@echo off
setlocal
echo ========================================================
echo   CHERUBIM - Live Public Online Deployment Runner
echo ========================================================
echo.

set "PATH=C:\Users\acer\tools\node;C:\Users\acer\.local\bin;C:\Users\acer\tools\git\cmd;%PATH%"

echo [1/3] Starting FastAPI Backend on port 8000...
start "CHERUBIM Backend" cmd /k "cd /d d:\CHERUBIM\backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Vite Frontend on port 3000...
start "CHERUBIM Frontend" cmd /k "cd /d d:\CHERUBIM\frontend && npm run dev -- --host 127.0.0.1 --port 3000"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Public HTTPS Tunnel to the Internet...
echo.
echo Connecting to global HTTPS gateway...
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 80:127.0.0.1:3000 serveo.net

pause
