'use strict';

const source = require('vinyl-source-stream');
const browserify = require('browserify');
const html = require('html-browserify');
const babelify = require('babelify');
const errorify = require('errorify');
const stylus = require('gulp-stylus');
const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');

const locals = {
  rules: require('./lib/rules'),
  checks: require('./lib/checks')
};

const PATH_TO_AXE = './node_modules/axe-core';
const AXE_FILE = 'axe.min.js';
const BUILD_DIR = 'build/axe';

gulp.task('default', ['build']);

gulp.task('build', ['clean', 'scripts', 'styles', 'copy']);

gulp.task('clean', function () {
  fs.emptyDirSync(BUILD_DIR);
  fs.ensureDirSync(BUILD_DIR);
});

gulp.task('scripts', () => {
  browserify('client/index.js')
    .transform(babelify, { presets: ["es2015"] })
    .transform(html)
    .plugin(errorify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('styles', () => {
  gulp.src('styles/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(BUILD_DIR));
  gulp.src('styles/**/*.css')
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy', () => {
  const axeSrc  = path.join(PATH_TO_AXE, AXE_FILE);
  const axeDest = path.join(BUILD_DIR, AXE_FILE);
  fs.copySync(axeSrc, axeDest);
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
