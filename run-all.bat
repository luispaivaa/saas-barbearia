@echo off
setlocal

set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
set "NODE_HOME=C:\Program Files\nodejs"
set "M2_HOME=C:\apache-maven-3.9.15"
set "PATH=%JAVA_HOME%\bin;%NODE_HOME%;%M2_HOME%\bin;%PATH%"

cd /d "C:\Users\paiva\OneDrive\Desktop\projetosCC\aps\saas-barbearia"
echo =============================================
echo Compilando backend com Maven...
echo =============================================
"%M2_HOME%\bin\mvn.cmd" clean package -DskipTests
if errorlevel 1 (
  echo.
  echo Erro: compilacao do backend falhou.
  pause
  endlocal
  exit /b 1
)
echo.
echo Build concluido com sucesso.
echo Iniciando backend e frontend...

start "Backend" cmd /k "cd /d "C:\Users\paiva\OneDrive\Desktop\projetosCC\aps\saas-barbearia" && java -jar target\barberstore-0.0.1-SNAPSHOT.jar"
start "Frontend" cmd /k "cd /d "C:\Users\paiva\OneDrive\Desktop\projetosCC\aps\saas-barbearia\frontend" && npm run dev"

echo Aguardando o frontend iniciar...
timeout /t 8 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo A aplicacao foi iniciada. Verifique os terminais do backend e frontend.
endlocal
