#!/usr/bin/env node

/// <reference path="src/typings/tsd.d.ts" />

var os = require('os');
var path = require('path');
var out_path = 'out';

// Using join deals with nix/win issues
var bin_path = path.join('.', 'node_modules', '.bin');

////////////////////////////////////////////////////////////////
// LESS
////////////////////////////////////////////////////////////////
var less_base = 'src/css';
var less_files = [
  'modern',
  'simple_default',
  'simple_solarized_dark',
  'simple_solarized_light'
];

////////////////////////////////////////////////////////////////
// TypeScript
////////////////////////////////////////////////////////////////
var ts_files = new jake.FileList();
ts_files.include('./src/**/*.ts');

var ts_outfile = 'out/app.js';
var ts_options = [
  '--out ' + ts_outfile,
  '--outDir ' + 'out',
  '--sourceMap',
  '--sourceRoot debug',
  '--module commonjs',
  '--noImplicitAny',
  '--removeComments'
];

////////////////////////////////////////////////////////////////
// Static Files
////////////////////////////////////////////////////////////////
var res_files = new jake.FileList();
res_files.include('src/images/dropbox-logos_dropbox-logotype-black-trimmed.png');
res_files.include('src/images/todotxt_js_logo.png');

var sup_files = new jake.FileList();
sup_files.include('src/js/lib/jquery.hotkeys.js');
sup_files.include('src/js/bindings/binding_todo.js');
sup_files.include('src/js/sample_dropbox_key.js');
sup_files.include('src/favicon.ico');
// Optional files
sup_files.include('src/js/dropbox_key.*');
sup_files.include('src/js/events.*');

////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////
function compileLessFile(file) {
  jake.logger.log('Compile LESS: ' + file);
  var inFile = path.join(less_base, file + '.less');
  var outFile = path.join(out_path, 'css', file + '.css');
  var cmd = path.join(bin_path, 'lessc') + ' --source-map ' + inFile + ' ' + outFile;
  jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
}

function compileTsFiles(watch) {
  jake.logger.log('Compile TypeScript');
  var files = ts_files.toArray().join(' ');
  var options = ts_options.join(' ');
  if (watch) {
    options += ' -w';
  }
  var cmd = path.join(bin_path, 'tsc') + ' ' + options + ' ' + files;
  jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
}

////////////////////////////////////////////////////////////////
// Tasks
////////////////////////////////////////////////////////////////

desc('This is the default task.');
task('default', ['build', 'test']);

desc('This is the default task.');
task('build', ['build:less', 'build:ts', 'build:res', 'build:html', 'build:sup'], function () {
  jake.logger.log('Build complete.');
});

namespace('build', function () {

  desc('Ensure build artifacts folder exists.');
  task('out', function () {
    jake.mkdirP(path.join(out_path, 'images'));
    jake.mkdirP(path.join(out_path, 'css'));
  });

  desc('Build TS files');
  task('ts-watch', ['out'], function () {
    compileTsFiles(true);
  });

  desc('Build TS files');
  task('ts', ['out', 'ts-debug'], function () {
    compileTsFiles();
  });

  desc('Place debug TS files');
  task('ts-debug', function () {
    ts_files.toArray().forEach(function (file) {
      var destination = path.join(out_path, 'debug', file);
      jake.mkdirP(path.join(out_path, 'debug', path.dirname(file).replace(/src[\\/]js[\\/]/, '')));
      jake.cpR(file, destination.replace(/src[\\/]js[\\/]/, ''));
    });
  });

  desc('Build Less files');
  task('less', ['out'], function () {
    less_files.forEach(compileLessFile);
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
    var source = path.join('src', 'todotxt.html');
    var destination = path.join(out_path, 'index.html');
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
