
# Script to tidy source folder of individual ts files

$tsfiles = Get-ChildItem ../src/*.ts -recurse

$tsfiles | ForEach-Object {
    $base = $_.BaseName
    $dir = $_.DirectoryName
    $js = Join-Path $dir ($base + ".js")
    $map = Join-Path $dir ($base + ".js.map")

    if (Test-Path $js) { Remove-Item $js -WhatIf }
    if (Test-Path $map) { Remove-Item $map -WhatIf }
}
