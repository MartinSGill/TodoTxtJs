/*******************************************************************************
 * Copyright (C) 2013-2015 Martin Gill
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

// Karma configuration
// Generated on Sat Nov 02 2013 15:20:02 GMT+0100 (W. Europe Standard Time)

module.exports = function(config) {
    config.set({

                   // base path, that will be used to resolve files and exclude
                   basePath: '),


                   // frameworks to use
                   frameworks: ['qunit'],


                   // list of files / patterns to load in the browser
                   files: [
                       // Files Under Test
                       'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js',
                       'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js',
                       '../src/js/utils/datetime.js',
                       '../src/js/model/regex.js',
                       '../src/js/model/ModelFactory.js',
                       '../src/js/model/todo.js',
                       '../src/js/model/todomanager.js',

                       // Tests
                       '../tests/**/*.tests.js'
                   ],

                   // list of files to exclude
                   exclude: [

                   ],


                   // test results reporter to use
                   // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
                   reporters: ['progress','growl'],


                   // web server port
                   port: 9876,


                   // enable / disable colors in the output (reporters and logs)
                   colors: true,


                   // level of logging
                   // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                   logLevel: config.LOG_INFO,


                   // enable / disable watching file and executing tests whenever any file changes
                   autoWatch: false,


                   // Start these browsers, currently available:
                   // - Chrome
                   // - ChromeCanary
                   // - Firefox
                   // - Opera (has to be installed with `npm install karma-opera-launcher`)
                   // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
                   // - PhantomJS
                   // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
                   browsers: ['Chrome'],


                   // If browser does not capture in given timeout [ms], kill it
                   captureTimeout: 60000,


                   // Continuous Integration mode
                   // if true, it capture browsers, run tests and exit
                   singleRun: false
               });
};
