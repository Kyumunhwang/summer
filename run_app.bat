@echo off
title Funday Dallar Market Fullstack Launcher

echo ========================================================
echo   Funday Dallar Market - Server Launcher
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend Server Port 8000
start "FastAPI Backend Server" cmd /k "%~dp0run_backend.bat"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Vite Frontend Server
cd /d "%~dp0"
npm run dev

pause
