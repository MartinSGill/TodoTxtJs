// Karma configuration
// Generated on Sun Jun 21 2015 15:44:42 GMT+0200 (W. Europe Summer Time)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.0.min.js',
      'http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/jquery-ui.min.js',
      'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js',
      'http://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.9.2/dropbox.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js',
      'src/lib/angular-mocks/angular-mocks.js',
      'src/lib/angular/angular.min.js',
      'out/app.js',
      'out/todotxt.js',
      'spec/tools/all.js', // Jasmine
      'spec/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
