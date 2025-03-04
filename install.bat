@echo off
setlocal enabledelayedexpansion

echo === Clipboard Viewer Installation ===
echo This script will help you set up your Google Generative AI API key.
echo.

set "USER_DATA_DIR=%APPDATA%\Clipboard Viewer"
set "CONFIG_FILE=%USER_DATA_DIR%\config.json"

:: Create user data directory if it doesn't exist
if not exist "%USER_DATA_DIR%" (
  mkdir "%USER_DATA_DIR%"
)

:: Prompt for API key
set /p API_KEY="Enter your Google Generative AI API key (or press Enter to skip): "

if not "%API_KEY%"=="" (
  :: Create or update the config.json file
  echo {"googleApiKey": "%API_KEY%"} > "%CONFIG_FILE%"
  
  if %ERRORLEVEL% EQU 0 (
    echo API key saved successfully!
  ) else (
    echo Failed to save API key. You can set it later in the app settings.
  )
) else (
  echo No API key provided. You can set it later in the app settings.
)

echo.
echo Clipboard Viewer setup is complete.
echo You can press Ctrl+Shift+T to show/hide the app once it's running.
echo.

pause 