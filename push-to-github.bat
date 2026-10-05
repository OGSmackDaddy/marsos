@echo off
setlocal

echo ==========================================================
echo     🔴 Pushing marsOS to GitHub...
echo ==========================================================
cd /d "%~dp0"

REM Use full path to Git
set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"

if not exist "%GIT_EXE%" (
    echo [-] Git not found at %GIT_EXE%.
    pause
    exit /b 1
)

echo [+] Executing: git push -u origin main
"%GIT_EXE%" push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [-] Push failed or was interrupted. Check error above.
) else (
    echo.
    echo ==========================================================
    echo  [✓] Successfully pushed marsOS to GitHub!
    echo      Check https://github.com/OGSmackDaddy/marsos/actions
    echo ==========================================================
)

pause
