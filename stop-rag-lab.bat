@echo off
echo Stopping RAG Lab services on ports 3000 and 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 :8000" ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>nul
echo Done.
pause
