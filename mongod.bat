@echo off
setlocal
REM Start MongoDB using the project's local data directory
REM Usage: Run this from the project root:  C:\...\gm-consultants> mongod

set DBPATH=%~dp0data\db
if not exist "%DBPATH%" (
  mkdir "%DBPATH%"
)

REM Call the real mongod executable (avoid recursion by calling mongod.exe)
mongod.exe --dbpath "%DBPATH%"
