@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  LM_OM ローカルサーバーを起動します
echo  ブラウザで次のURLを開いてください:
echo.
echo    http://localhost:8765/evitara-lean3-pages-editor.html
echo.
echo  終了するにはこのウィンドウで Ctrl+C を押してください
echo.
python -m http.server 8765 2>nul
if errorlevel 1 (
  echo Python が見つかりません。Node.js で起動を試みます...
  npx --yes serve -l 8765 .
)
pause
