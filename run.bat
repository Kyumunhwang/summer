@echo off
chcp 65001 >nul
title 2026 Summer School STAMP Market Auto Launcher

echo ========================================================
echo   ☀️ 2026 SUMMER SCHOOL STAMP MARKET 자동 실행기
echo ========================================================
echo.

:: 1. 작업 디렉토리 설정
cd /d "%~dp0"

:: 2. 환경 변수 PATH 갱신
set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"

:: 3. Node.js 설치 여부 확인
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Node.js가 설치되어 있지 않습니다.
    echo 🚀 필수 프로그램(Node.js LTS) 자동 설치를 진행합니다...
    echo.

    :: winget 사용 가능 여부 확인 후 자동 설치
    where winget >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [1/2] winget을 사용하여 Node.js를 설치 중입니다. 잠시만 기다려주세요...
        winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent
    ) else (
        echo [1/2] PowerShell을 사용하여 Node.js 설치 파일을 다운로드 및 설치 중입니다...
        powershell -Command "$msi = '$env:TEMP\node_setup.msi'; iwr -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile $msi; Start-Process msiexec.exe -ArgumentList '/i', $msi, '/qn' -Wait; Remove-Item $msi"
    )

    :: 설치 후 PATH 재설정
    set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"
    echo.
    echo ✅ Node.js 설치가 완료되었습니다!
    echo.
) else (
    echo ✅ Node.js가 정상적으로 설치되어 있습니다.
)

:: 4. 의존성 패키지(node_modules) 존재 여부 확인 및 설치
if not exist "node_modules\" (
    echo 📦 프로젝트 패키지(node_modules)가 없습니다. 자동으로 설치합니다...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 패키지 설치 중 오류가 발생했습니다.
        pause
        exit /b 1
    )
    echo ✅ 패키지 설치 완료!
    echo.
)

:: 5. 3초 후 웹 브라우저 자동 열기
echo 🌐 서버 실행 후 브라우저가 열립니다 (https://localhost:5173/ 또는 https://192.168.5.118:5173/)
start "" powershell -Command "Start-Sleep -Seconds 3; Start-Process 'https://localhost:5173/'"

:: 6. 개발 서버 실행
echo 🚀 STAMP Market 서버를 실행합니다...
echo.
call npm run dev

pause
