@echo off

echo This will install node modules using NPM.
echo Abort now if you don't have nodejs or npm installed.
echo(
pause
:: Change to script dir
pushd %~dp0

:: Install Required Modules

:: Change compiler version if you get build errors
call npm install karma --save-dev --msvs_version=2013

call npm install qunitjs --save-dev
call npm install karma-chrome-launcher --save-dev
call npm install karma-growl-reporter --save-dev
call npm install karma-qunit --save-dev

:: restore directory
popd
