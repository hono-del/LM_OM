@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo.
echo  ========================================
echo   Lean3 OWNER'S ASSISTANT
echo   モックアプリ ローカルサーバー
echo  ========================================
echo.
echo  ブラウザで次のURLを開いてください:
echo.
echo    http://localhost:8765/owners-assistant/index.html
echo.
echo  終了するにはこのウィンドウで Ctrl+C を押してください
echo.
echo  ========================================
echo.

python -m http.server 8765 2>nul
if errorlevel 1 (
  echo.
  echo  Python が見つかりません。Node.js で起動を試みます...
  echo.
  npx --yes serve -l 8765 .
)
pause
