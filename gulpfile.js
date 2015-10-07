
/**
 * Module dependencies.
 */

var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');

/**
 * Define constants.
 */

var PATH_TO_AXE = 'node_modules/axe-core';
var AXE_FILE = 'axe.min.js';
var BUILD_DIR = 'dist';

/**
 * Define tasks.
 */

gulp.task('default', ['build']);

gulp.task('watch', function () {
  gulp.watch('src/**/*', ['default']);
});

gulp.task('clean', function () {
  fs.emptyDirSync(BUILD_DIR);
  fs.ensureDirSync(BUILD_DIR);
});

gulp.task('build', ['clean'], function () {
  // Copy axe to dist
  var axeSrc  = path.join(PATH_TO_AXE, AXE_FILE);
  var axeDest = path.join(BUILD_DIR, AXE_FILE);
  fs.copySync(axeSrc, axeDest);

  // Render jade files
  gulp.src('src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(BUILD_DIR));

  // Compile stylus files
  gulp.src('src/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(BUILD_DIR));

  // Copy js to dist
  gulp.src('src/**/*.js')
    .pipe(gulp.dest(BUILD_DIR));

});
