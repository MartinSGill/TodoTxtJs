Build
=====

Build System & Server for development use.

Based on a blog post by Jesse Freeman: http://goo.gl/jUiLsK

Requirements
------------

* [NodeJs](http://nodejs.org/)
* grunt (& grunt-cli)

Caveats
-------

* I've tested this on Windows only, but should work on *nix systems as well.
* The Error `error TS2140: 'this' cannot be referenced in initializers in a class body.` is currently
  expected as grunt hasn't been updated to the latest typescript yet, cf. http://goo.gl/qlBi1w 
* Examples below assume you're using powershell, but syntax should be the same for CMD, BASH etc.


Getting Started
---------------

*  Install [NodeJs](http://nodejs.org/)
*  If you plan to use Visual Studio download the [Typescript extension](http://www.microsoft.com/en-us/download/details.aspx?id=34790).

**You'll need to use a command-line for everything after this point.**

*  Ensure you are in the "build" folder.

```PowerShell
    ...\TodoTxtJs> cd build
```

*  Install dependencies (defined in package.json)

```PowerShell
    ...\TodoTxtJs\build> npm install
```

*  Install grunt (globally)

```PowerShell
    ...\TodoTxtJs\build> npm install grunt -g
```

*  Install grunt-cli (globally)

```PowerShell
    ...\TodoTxtJs\build> npm install grunt-cli -g
```

*   Initial Compile of Typescript files

```PowerShell
    ...\TodoTxtJs\build> grunt typescript
```

Only `src/app.js` is actually needed by the webpage. `clean.ps1` removes unneeded *.js files.

*  (optional) watch typescript files for changes & start web-server

```PowerShell
    ...\TodoTxtJs\build> grunt
```

This will also open your browser to a local server that serves the TodoTxtJS project ready to be used.

If you want to use dropbox to save/load your files, then you'll need to create your own dropbox API key.
see [sample_dropbox.js](https://github.com/MartinSGill/TodoTxtJs/blob/master/src/js/sample_dropbox_key.js) for details.
