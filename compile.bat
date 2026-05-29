@echo off
setlocal enabledelayedexpansion

set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
set "PATH=!JAVA_HOME!\bin;%PATH%"
set "M2_HOME=C:\apache-maven-3.9.15"
set "PATH=!M2_HOME!\bin;!PATH!"

cd /d "C:\Users\paiva\OneDrive\Desktop\projetosCC\aps\saas-barbearia"

echo Compilando com Java 21 e Maven 3.9.15...
"!M2_HOME!\bin\mvn.cmd" clean package -DskipTests

endlocal
