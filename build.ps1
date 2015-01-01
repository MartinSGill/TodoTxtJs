
Write-Host '** Building WebApp **'
npm install --prefix ./WebApp ./WebApp
WebApp/node_modules/.bin/grunt.cmd --gruntfile ./WebApp/GruntFile.js release

Write-Host '** Server **'
npm install --prefix ./TodoTxtJsServer ./TodoTxtJsServer
TodoTxtJsServer/node_modules/.bin/grunt.cmd --gruntfile ./TodoTxtJsServer/GruntFile.js release
