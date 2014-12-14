#!/usr/bin/env bash

npm install --prefix ./WebApp ./WebApp
WebApp/node_modules/.bin/grunt --gruntfile ./WebApp/GruntFile.js release

npm install --prefix ./TodoTxtJsServer ./TodoTxtJsServer
TodoTxtJsServer/node_modules/.bin/grunt --gruntfile ./TodoTxtJsServer/GruntFile.js release

