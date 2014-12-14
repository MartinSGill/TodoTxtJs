/*******************************************************************************
 * Copyright (C) 2013-2014 Martin Gill
 *     based on a blog post by Jesse Freeman (http://goo.gl/jUiLsK)
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/


module.exports = function (grunt) {

    var version = grunt.option('version') || '1.6.0';

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.initConfig({
                         pkg: grunt.file.readJSON('package.json'),
                         connect: {
                             server: {
                                 options: {
                                     port: 60000,
                                     base: './src/'
                                 }
                             }
                         },
                         typescript: {
                             base: {
                                 src: ['./src/**/*.ts'],
                                 dest: './src/js/app.js',
                                 options: {
                                     module: 'commonjs',
                                     target: 'es5',
                                     sourcemap: true,
                                     fullSourceMapPath: true
                                 }
                             }
                         },
                         less: {
                             production: {
                                 options: {
                                     yuicompress: true
                                 },
                                 files: {
                                     "./src/css/simple_default.css": "./src/css/simple_default.less",
                                     "./src/css/simple_solarized_dark.css": "./src/css/simple_solarized_dark.less",
                                     "./src/css/simple_solarized_light.css": "./src/css/simple_solarized_light.less"
                                 }
                             }
                         },
                         watch: {
                             typescript:
                             {
                                files: './src/**/*.ts',
                                tasks: ['typescript']
                             },
                             less:
                             {
                                 files: './src/**/*.less',
                                 tasks: ['less']
                             }
                         },
                         open: {
                             dev: {
                                 path: 'http://localhost:60000/todotxt.html'
                             }
                         },
                         uglify: {
                             options: {
                                 compress: {
                                     global_defs: {
                                         "DEBUG": false
                                     },
                                     dead_code: true
                                 }
                             },
                             my_target: {
                                 files: {
                                     './src/js/app.min.js': ['./src/js/app.js']
                                 }
                             }
                         },
                         compress: {
                             release: {
                                 options: {
                                     archive: '../out/todotxtjs.' + version + '.zip'
                                 },
                                 files: [
                                     { expand: true, src: ['*'], cwd: 'src/', filter: 'isFile'},
                                     { expand: true, src: ['.htaccess'], cwd: 'src/'},
                                     { expand: true, src: ['js/app.min.js'], cwd: 'src/'},
                                     { expand: true, src: ['js/sample_dropbox_key.js'], cwd: 'src/'},
                                     { expand: true, src: ['js/bindings/binding_todo.js'], cwd: 'src/'},
                                     { expand: true, src: ['js/lib/jquery.hotkeys.js'], cwd: 'src/'},
                                     { expand: true, src: ['css/*.css'], cwd: 'src/' },
                                     { expand: true, src: ['images/*'], cwd: 'src/' }
                                 ]
                             }
                         }
                     });

    grunt.registerTask('release', ['build', 'uglify', 'compress']);
    grunt.registerTask('build', ['typescript', 'less']);
    grunt.registerTask('default', ['build', 'connect', 'open', 'watch']);
};
