@echo off
set "PATH=C:\Users\khush\AppData\Local\Programs\Git\cmd;%PATH%"
cd /d "c:\Users\khush\OneDrive\Documents\ai-career-growth-engine-main"
echo ====================================================
echo Pushing latest updates to your GitHub repository...
echo ====================================================
git push -u origin main --force
echo.
echo ====================================================
echo Done! Check your repository on GitHub.
echo ====================================================
pause
