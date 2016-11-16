'use strict';

var stylus = require('gulp-stylus');
var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var Duo = require('duo');

var locals = {
  rules: require('./lib/rules'),
  checks: require('./lib/checks')
};

var PATH_TO_AXE = './node_modules/axe-core';
var AXE_FILE = 'axe.min.js';
var BUILD_DIR = 'build/axe';

gulp.task('default', ['build']);

gulp.task('build', ['clean', 'scripts', 'styles', 'copy']);

gulp.task('clean', function () {
  fs.emptyDirSync(BUILD_DIR);
  fs.ensureDirSync(BUILD_DIR);
});

gulp.task('scripts', done => {
  Duo(__dirname)
    .entry('client/index.js')
    .run(function (err, res) {
      if (err) throw err;
      fs.writeFileSync(path.join(BUILD_DIR, 'index.js'), res.code);
      done();
    });
});

gulp.task('styles', () => {
  gulp.src('styles/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(BUILD_DIR));
  gulp.src('styles/**/*.css')
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy', () => {
  var axeSrc  = path.join(PATH_TO_AXE, AXE_FILE);
  var axeDest = path.join(BUILD_DIR, AXE_FILE);
  // fs.copySync(axeSrc, axeDest);
  gulp.src('images/*.*')
    .pipe(gulp.dest(path.join(BUILD_DIR, 'images')));
});

gulp.task('watch', function () {
  gulp.watch('examples/**/*', ['default']);
  gulp.watch('images/**/*', ['default']);
  gulp.watch('lib/**/*', ['default']);
  gulp.watch('styles/**/*', ['default']);
  gulp.watch('views/**/*', ['default']);
});
