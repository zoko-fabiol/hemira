@echo off
title Hemira Admin - Git Push
set "PATH=C:\Users\Claus\AppData\Local\Programs\Git\cmd;C:\Users\Claus\AppData\Local\Programs\Git Credential Manager;%PATH%"
cd /d "e:\Telechargement\Compressed\hemira-travel-services-with-instant-preview\admin hemira"

echo ========================================================
echo           HEMIRA ADMIN - PUSH VERS GITHUB
echo ========================================================
echo.
echo Tentative de push vers https://github.com/zoko-fabiol/admin-hemira.git ...
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCES] Votre projet a ete pousse sur GitHub avec succes !
) else (
    echo [ATTENTION] Le push necessite votre autorisation GitHub.
)
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
