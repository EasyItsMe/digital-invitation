@echo off
title Undangan Digital Online - Blue Butterfly (Ami & Azis)
echo ====================================================================
echo   MEMBUKA WEB UNDANGAN DIGITAL ONLINE: SITI AMI & ABDUL AZIS
echo   Serta Tasyakuran Walimatul Khitan: Andiks Satria & Raditya Panca
echo ====================================================================
echo.

set PYCMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PYCMD=py
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe" (
        set PYCMD="C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe"
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe" (
        set PYCMD="C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe"
    )
)

echo Membuka web undangan di browser...
start http://localhost:8080/index.html?to=Tamu+Undangan
%PYCMD% -m http.server 8080

pause
