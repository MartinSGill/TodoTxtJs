@echo off

:: Change to script dir
pushd %~dp0

:: Run Test Monitor
call node_modules\.bin\karma.cmd start

:: Restore Dir
popd
