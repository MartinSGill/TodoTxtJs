#!/usr/bin/env node

/// <reference path="src/typings/tsd.d.ts" />

var os = require('os');
var path = require('path');
var out_path = 'out';

// Using join deals with nix/win issues
var bin_path = path.join('.', 'node_modules', '.bin');

////////////////////////////////////////////////////////////////
// Static Files
////////////////////////////////////////////////////////////////
var res_files = new jake.FileList();
res_files.include('src/images/dropbox-logos_dropbox-logotype-black-trimmed.png');
res_files.include('src/images/todotxt_js_logo.png');

var sup_files = new jake.FileList();
sup_files.include('src/favicon.ico');

////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////
function compileTsFiles() {
  var cmd = path.join(bin_path, 'tsc');
  jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
}

////////////////////////////////////////////////////////////////
// Tasks
////////////////////////////////////////////////////////////////

desc('This is the default task.');
task('default', ['build', 'test']);

desc('This is the default task.');
task('build', ['build:ts', 'build:res', 'build:html', 'build:sup'], function () {
  jake.logger.log('Build complete.');
});

namespace('build', function () {

  desc('Ensure build artifacts folder exists.');
  task('out', function () {
    jake.mkdirP(path.join(out_path, 'images'));
    jake.mkdirP(path.join(out_path, 'css'));
  });

  desc('Build TS files');
  task('ts', ['out'], function () {
    compileTsFiles();
  });

  desc('Build/deploy resources');
  task('res', ['out'], function () {
    jake.logger.log('Compile Resources');
    res_files.toArray().forEach(function (file) {
      var destination = path.join(out_path, 'images', path.basename(file));
      jake.cpR(file, destination);
    });
  });

  desc('Build/deploy supplementary JS files');
  task('sup', ['out'], function () {
    jake.logger.log('Compile Supplemental Files');
    sup_files.toArray().forEach(function (file) {
      var destination = path.join(out_path, path.basename(file));
      jake.cpR(file, destination);
    });
  });

  desc('Build/deploy HTML');
  task('html', ['out'], function () {
    jake.logger.log('Compile HTML');
    var source = path.join('src', 'default.html');
    var destination = path.join(out_path, 'default.html');
    jake.cpR(source, destination);
  });
});

desc('Run Tests');
task('test', [], function () {
  jake.logger.log('Starting test run.');
  var cmd = path.join(bin_path, 'karma') + ' start --single-run';
  jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
});

desc('Run server');
task('server', ['default'], function () {
  jake.logger.log('Starting Server...');
  var cmd = path.join(bin_path, 'http-server') + ' out -o';
  jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
});
