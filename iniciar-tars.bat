@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Abrindo a versao offline no navegador.
  echo Para usar o servidor local, instale Node.js LTS de https://nodejs.org
  start "" "%~dp0index.html"
  pause
  exit /b 0
)
echo Iniciando T.A.R.S. Mantenha esta janela aberta durante a jornada.
node tools\serve.mjs --open
if errorlevel 1 pause
