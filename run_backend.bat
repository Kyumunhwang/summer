@echo off
title Funday Dallar Market Backend Server

echo ========================================================
echo   Funday Dallar Market - FastAPI Backend (Port 8000)
echo ========================================================
echo.

cd /d "%~dp0backend"

if not exist "venv" (
    echo Creating Python Virtual Environment venv
    python -m venv venv
)

echo Activating Virtual Environment and Checking Packages
call venv\Scripts\activate.bat
pip install -q -r requirements.txt

echo Starting FastAPI Backend on Port 8000
echo --------------------------------------------------------
echo Backend API  : http://localhost:8000
echo API Docs     : http://localhost:8000/docs
echo --------------------------------------------------------
echo.

python main.py

pause
