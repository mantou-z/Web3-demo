@echo off
setlocal EnableExtensions

title Alcheme Launcher

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_PORT=30001"
set "FRONTEND_PORT=3001"

echo ========================================
echo Alcheme Windows Launcher
echo ========================================
echo Root: %ROOT_DIR%
echo.

where node >nul 2>nul
if errorlevel 1 goto :node_missing

where npm >nul 2>nul
if errorlevel 1 goto :npm_missing

if not exist "%BACKEND_DIR%\package.json" goto :backend_missing
if not exist "%FRONTEND_DIR%\package.json" goto :frontend_missing

if not exist "%BACKEND_DIR%\.env" (
  if exist "%BACKEND_DIR%\.env.example" (
    copy /Y "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
    echo [INFO] Created backend\.env from .env.example
  )
)

if not exist "%FRONTEND_DIR%\.env" (
  if exist "%FRONTEND_DIR%\.env.example" (
    copy /Y "%FRONTEND_DIR%\.env.example" "%FRONTEND_DIR%\.env" >nul
    echo [INFO] Created frontend\.env from .env.example
  )
)

if not exist "%BACKEND_DIR%\node_modules" (
  echo [INFO] Installing backend dependencies...
  pushd "%BACKEND_DIR%"
  call npm install
  if errorlevel 1 (
    popd
    goto :backend_install_failed
  )
  popd
) else (
  echo [INFO] Backend dependencies already installed.
)

if not exist "%FRONTEND_DIR%\node_modules" (
  echo [INFO] Installing frontend dependencies...
  pushd "%FRONTEND_DIR%"
  call npm install
  if errorlevel 1 (
    popd
    goto :frontend_install_failed
  )
  popd
) else (
  echo [INFO] Frontend dependencies already installed.
)

echo.
echo [INFO] Starting backend...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -WorkingDirectory '%BACKEND_DIR%' -ArgumentList '-NoExit','-Command','$env:PORT=''%BACKEND_PORT%''; node src/index.js'"
if errorlevel 1 goto :backend_start_failed

echo [INFO] Starting frontend...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -WorkingDirectory '%FRONTEND_DIR%' -ArgumentList '-NoExit','-Command','npm run dev -- -p 3001'"
if errorlevel 1 goto :frontend_start_failed

echo.
echo Launch commands sent successfully.
echo Backend : http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo.
echo Close the two opened PowerShell windows to stop the services.
pause
exit /b 0

:node_missing
echo [ERROR] node was not found. Please install Node.js first.
pause
exit /b 1

:npm_missing
echo [ERROR] npm was not found. Please make sure Node.js is installed correctly.
pause
exit /b 1

:backend_missing
echo [ERROR] backend\package.json was not found.
pause
exit /b 1

:frontend_missing
echo [ERROR] frontend\package.json was not found.
pause
exit /b 1

:backend_install_failed
echo [ERROR] backend npm install failed.
pause
exit /b 1

:frontend_install_failed
echo [ERROR] frontend npm install failed.
pause
exit /b 1

:backend_start_failed
echo [ERROR] failed to start backend window.
pause
exit /b 1

:frontend_start_failed
echo [ERROR] failed to start frontend window.
pause
exit /b 1
