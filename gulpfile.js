
/**
 * Module dependencies.
 */

var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var duo = require('gulp-duojs');
var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');

var locals = {
  rules: require('./lib/rules'),
  checks: require('./lib/checks')
};

/**
 * Define constants.
 */

var PATH_TO_AXE = 'node_modules/axe-core';
var AXE_FILE = 'axe.min.js';
var BUILD_DIR = 'build';

/**
 * Define tasks.
 */

gulp.task('default', ['build']);

gulp.task('watch', function () {
  gulp.watch('examples/**/*', ['default']);
  gulp.watch('images/**/*', ['default']);
  gulp.watch('lib/**/*', ['default']);
  gulp.watch('styles/**/*', ['default']);
  gulp.watch('views/**/*', ['default']);
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

  // Build client scripts
  gulp.src('client/index.js')
    .pipe(duo())
    .pipe(gulp.dest(BUILD_DIR));

  // Compile stylus files
  gulp.src('styles/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(BUILD_DIR));

  // Copy css to dist
  gulp.src('styles/**/*.css')
    .pipe(gulp.dest(BUILD_DIR));

  // Copy images to dist
  gulp.src('images/*.*')
    .pipe(gulp.dest(path.join(BUILD_DIR, 'images')));

});
