@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title RAG Lab Launcher

echo.
echo ========================================
echo        Starting RAG Lab for Windows
echo ========================================
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  set "PYTHON=py"
) else (
  where python >nul 2>nul
  if errorlevel 1 goto :no_python
  set "PYTHON=python"
)

where npm.cmd >nul 2>nul
if errorlevel 1 goto :no_node

if not exist "backend\.venv\Scripts\python.exe" (
  echo [1/4] Creating the Python environment...
  %PYTHON% -m venv "backend\.venv" || goto :failed
)

echo [2/4] Preparing the backend...
"backend\.venv\Scripts\python.exe" -m pip install -q -r "backend\requirements.txt" || goto :failed

echo [3/4] Preparing the frontend...
if not exist "frontend\node_modules" call npm.cmd --prefix frontend install --no-audit --no-fund || goto :failed

if /i "%~1"=="--check" (
  echo Launcher check completed successfully.
  exit /b 0
)

echo [4/4] Opening RAG Lab...
start "RAG Lab API" cmd /k "cd /d ""%~dp0backend"" && .venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
start "RAG Lab UI" cmd /k "cd /d ""%~dp0frontend"" && npm.cmd run dev"
timeout /t 6 /nobreak >nul
start "" "http://localhost:3000"
echo RAG Lab is running. Keep the two service windows open.
timeout /t 4 >nul
exit /b 0

:no_python
echo Python 3.11 or newer is required. Install it from https://python.org/downloads/
pause
exit /b 1

:no_node
echo Node.js 22 or newer is required. Install it from https://nodejs.org/
pause
exit /b 1

:failed
echo Setup failed. Read the message above, then run this file again.
pause
exit /b 1
