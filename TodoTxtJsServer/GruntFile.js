/*******************************************************************************
 * Copyright (C) 2013-2014 Martin Gill
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

    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.initConfig({
                         compress: {
                             release: {
                                 options: {
                                     archive: '../out/todotxtjsserver.' + version + '.zip'
                                 },
                                 files: [
                                     { expand: true, src: ['bin/*']},
                                     { expand: true, src: ['public/stylesheets/*']},
                                     { expand: true, src: ['views/*']},
                                     { expand: true, src: ['routes/*']},
                                     { expand: true, src: ['app.js']},
                                     { expand: true, src: ['package.json']},
                                     { expand: true, src: ['Readme.md']},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['*'], filter: 'isFile'},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['.htaccess'] },
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['js/app.min.js']},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['js/sample_dropbox_key.js']},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['js/bindings/binding_todo.js']},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['js/lib/jquery.hotkeys.js']},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['css/*.css']},
                                     { expand: true, cwd: '../WebApp/src/', dest: 'public/', src: ['images/*']}
                                 ]
                             }
                         }
                     });

    grunt.registerTask('release', ['compress']);
};
