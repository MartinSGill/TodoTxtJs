var gulp = require('gulp');
var jade = require('gulp-jade');
var tsc = require('gulp-typescript');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = tsc.createProject('tsconfig.json');

const JADE_FILES = './src/**/*.jade';
const TYPESCRIPT_FILES = './src/**/*.ts';
const TYPESCRIPT_EXCLUDE = '!./src/node_modules/**/*.ts';
const LESS_FILES = './src/**/style.less';

gulp.task('default', ['build']);
gulp.task('build', ['jade', 'tsc']);

gulp.task('jade', function () {
  gulp.src(JADE_FILES)
    .pipe(jade())
    .pipe(gulp.dest('./src'))
});

gulp.task('tsc', function () {
  var tsResult = gulp.src([TYPESCRIPT_FILES, TYPESCRIPT_EXCLUDE])
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));

  tsResult.dts.pipe(gulp.dest('./src'));
  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src'));
});

gulp.task('less', function () {
  gulp.src(LESS_FILES)
    .pipe(less())
    .pipe(gulp.dest('./src'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch(JADE_FILES, ['jade']);
  gulp.watch(LESS_FILES, ['less']);
  gulp.watch([TYPESCRIPT_FILES, TYPESCRIPT_EXCLUDE], ['tsc']);
});

gulp.task('dist', function() {

});