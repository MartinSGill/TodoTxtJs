#!/usr/bin/env node
var os = require('os');
var path = require('path');
var out_path = 'out';

// Using join deals with nix/win issues
var bin_path =  path.join('.', 'node_modules','.bin');

var less_base = 'src/css';
var less_files = [
    'modern',
    'simple_default',
    'simple_solarized_dark',
    'simple_solarized_light'
];

var ts_files = new jake.FileList();
ts_files.include('./src/js/**/*.ts');

var ts_outfile = 'out/app.js';
var ts_options = [
    '--out ' + ts_outfile,
    '--sourceMap',
    '--module commonjs',
    //'--noImplicitAny',
    '--removeComments'
];

var res_files = new jake.FileList();
res_files.include('src/images/dropbox-logos_dropbox-logotype-black-trimmed.png');
res_files.include('src/images/todotxt_js_logo.png');

var sup_files = new jake.FileList();
sup_files.include('src/js/lib/jquery.hotkeys.js');
sup_files.include('src/js/bindings/binding_todo.js');
sup_files.include('src/js/sample_dropbox_key.js');
// Optional files
sup_files.include('src/js/dropbox_key.*');
sup_files.include('src/js/events.*');


function compileLessFile(file) {
    jake.logger.log('Compile LESS: ' + file);
    var in_file = path.join(less_base, file + '.less');
    var out_file = path.join(out_path, 'css', file + '.css');
    var cmd = path.join(bin_path, 'lessc') + ' --source-map ' + in_file + ' ' + out_file;
    jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
}

function compileTsFiles() {
    jake.logger.log('Compile TypeScript');
    var files = ts_files.toArray().join(' ');
    var options = ts_options.join(' ');
    var cmd = path.join(bin_path, 'tsc') + ' ' + options + ' ' + files;
    jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
}

desc('This is the default task.');
task('default', ['less', 'ts', 'res', 'html', 'sup']);

desc('Ensure build artifacts folder exists.');
task('out', function (params) {
    jake.mkdirP(path.join(out_path, 'images'));
    jake.mkdirP(path.join(out_path, 'css'));
});

desc('Build TS files');
task('ts', ['out'], function (params) {
    compileTsFiles();
});

desc('Build Less files');
task('less', ['out'], function (params) {
    less_files.forEach(compileLessFile);
});

desc('Build/deploy resources');
task('res', ['out'], function (params) {
    jake.logger.log('Compile Resources');
    res_files.toArray().forEach(function (file) {
        var destination = path.join(out_path, 'images', path.basename(file));
        jake.cpR(file, destination);
    });
});

desc('Build/deploy supplementary JS files');
task('sup', ['out'], function (params) {
    jake.logger.log('Compile Supplemental Files');
    sup_files.toArray().forEach(function (file) {
        var destination = path.join(out_path, path.basename(file));
        jake.cpR(file, destination);
    });
});

desc('Build/deploy HTML');
task('html', ['out'], function (params) {
    jake.logger.log('Compile HTML');
    var source = path.join('src', 'todotxt.html');
    var destination = path.join(out_path, 'index.html');
    jake.cpR(source, destination);
});

desc('Run server');
task('server', ['default'], function (params) {
    var cmd = path.join(bin_path,'http-server') + ' out -o';
    jake.exec(cmd, {printStdout: !jake.program.opts.quiet, breakOnError: true});
});