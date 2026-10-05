@echo off
setlocal enabledelayedexpansion

echo ==========================================================
echo     🔴 marsOS "Cyber Sol" — Windows Docker Builder
echo ==========================================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [-] Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [+] Building marsOS builder Docker image...
cd /d "%~dp0\.."
docker build -t marsos-builder -f build-docker/Dockerfile .

if %errorlevel% neq 0 (
    echo [-] Failed to build docker image.
    pause
    exit /b 1
)

echo [+] Creating output directory...
if not exist "dist" mkdir dist

echo [+] Running build container with privileged flag...
docker run --privileged --rm ^
  -v "%cd%/marsos-profile:/workspace/marsos-profile" ^
  -v "%cd%/dist:/workspace/dist" ^
  -v "%cd%/build-docker:/workspace/build-docker" ^
  marsos-builder

if %errorlevel% neq 0 (
    echo [-] ISO build failed. Check the log output above.
    pause
    exit /b 1
)

echo ==========================================================
echo  [✓] marsOS ISO built successfully!
echo      Check the "dist" folder in this repository.
echo ==========================================================
pause
