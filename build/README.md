Build
=====

Build System & Server for development use.

Based on a blog post by Jesse Freeman: http://goo.gl/jUiLsK

Requirements
------------

* NodeJs
* grunt (& grunt-cli)

Caveats
-------

* Test this on Windows only, but should work on *nix systems as well.
* The Error "error TS2140: 'this' cannot be referenced in initializers in a class body." is currently
  expected. See: http://goo.gl/qlBi1w
* Examples below assume you're using powershell.


Getting Started
---------------

You'll need to use a command-line for most of this.

*  Install NodeJS

*  Install grunt

    PS> npm install grunt -g

*  Install grunt-cli

    PS> npm install grunt-cli -g

*  Ensure you are in the "build" folder.
   Compile typescript files

    PS> grunt typescript

*  (optional) watch typescript files for changes

    PS> grunt

This will also open your browser to a local server that servers the TodoTxtJS project ready to be used.
If you want to use dropbox to save/load your files, then you'll need to create your own dropbox API key.
see src/js/sample_dropbox_key.js for details.
