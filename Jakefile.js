#!/usr/bin/env node
var fs = require("fs");
var os = require("os");
var path = require("path");

var less_base = 'src/css';
var less_files = [
    'modern',
    'simple_default',
    'simple_solarized_dark',
    'simple_solarized_light'
];

var ts_base = './src/js/';
var ts_files =
    [
        ts_base + 'model/contentRender.ts',
        ts_base + 'model/ModelFactory.ts',
        ts_base + 'model/options.ts',
        ts_base + 'model/regex.ts',
        ts_base + 'model/todo.ts',
        ts_base + 'model/todomanager.ts',

        ts_base + 'storage/storage_browser.ts',
        ts_base + 'storage/storage_dropbox.ts',

        ts_base + 'utils/datetime.ts',
        ts_base + 'utils/events.ts',

        ts_base + 'views/displayOptions.ts',
        ts_base + 'views/exporting.ts',
        ts_base + 'views/importing.ts',
        ts_base + 'views/todotxt.ts'
    ];
var ts_outfile = 'app.js';
var ts_options = [
    '--out ' + ts_outfile,
    '--sourceMap',
    '--module commonjs',
    //'--noImplicitAny',
    '--removeComments'
];

function compileLessFile(file) {
    var in_file = path.join(less_base, file + '.less');
    var out_file = path.join(less_base, file + '.css');
    var cmd = 'lessc --source-map ' + in_file + ' ' + out_file;
    jake.exec(cmd, {interactive: true, breakOnError: true});
}

function compilteTsFiles() {
    var files = ts_files.join(' ');
    var options = ts_options.join(' ');
    var cmd = "tsc " + options + ' ' + files;
    jake.exec(cmd, {interactive: true, breakOnError: true});
}

desc('This is the default task.');
task('default', ['less', 'ts']);

desc('Build TS files');
task('ts', function (params) {
    compilteTsFiles();
});


desc('Build Less file');
task('less', function (params) {
    less_files.forEach(compileLessFile);
});