@echo off
setlocal
title CIZENTECH Support - Start
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\local-server.ps1" -Action Start %*
set "result=%errorlevel%"
if not "%SUPPORT_NO_PAUSE%"=="1" pause
exit /b %result%
