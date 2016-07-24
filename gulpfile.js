var rimraf  = require('rimraf');
var gulp    = require('gulp');
var jade    = require('gulp-jade');
var stylus  = require('gulp-stylus');
var copy    = require('gulp-copy');
var connect = require('gulp-connect');
var initialized = false;

/**
 * Default
 */

gulp.task('clean', function (cb) {
  
  if (!initialized) {
    rimraf('./public', function () {
      initialized = true;
      cb();
    });
  } else {
    cb();
  }
  
});

gulp.task('jade', ['clean'], function buildHTML() {
  return gulp.src(['./src/index.jade', './src/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());
});

gulp.task('stylus', ['clean'], function buildCSS() {
  return gulp.src('./src/assets/css/index.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(connect.reload());
});

gulp.task('img', ['clean'], function copyImages() {
  return gulp.src(['./src/assets/img/*/*.png', './src/assets/img/*/*.jpg'])
    .pipe(copy('./public/assets/img', {
      prefix: 3
    }));
});

gulp.task('lib-js', ['clean'], function copyJSLibs() {
  return gulp.src([
    './src/assets/lib/angular/angular.js',
    './src/assets/lib/jquery/dist/jquery.js',
    './src/assets/lib/semantic/dist/semantic.js',
    './src/assets/lib/angular-ui-router/release/angular-ui-router.js'
  ])
    .pipe(copy('./public/assets/lib', {prefix: 100}));
});

gulp.task('lib-css', ['clean'], function copyCSSLibs() {
  return gulp.src([
    './src/assets/lib/semantic/dist/semantic.css'
  ])
    .pipe(copy('./public/assets/css', {prefix: 100}));
});

gulp.task('favicon', ['clean'], function copyFavicon() {
  return gulp.src([
    './src/favicon.ico'
  ])
    .pipe(copy('./public', {prefix: 100}));
});

gulp.task('js', ['clean'], function copyJS() {
  return gulp.src([
    './src/app/**/*.js'
  ])
    .pipe(copy('./public', {prefix: 1}))
    .pipe(connect.reload());
});

gulp.task('font', ['clean'], function copyFont() {
  return gulp.src([
    './src/assets/lib/semantic/dist/**/*'
  ])
    .pipe(copy('./public/assets/lib', {prefix: 5}));
  
  // return gulp.src([
  //   './src/assets/lib/font-awesome/**/*'
  // ])
  //   .pipe(copy('./public', {prefix: 1}));
});

/**
 * Dev
 */

gulp.task('connect', function connectServer() {
  return connect.server({
    root: './public',
    livereload: true,
    port: 3100
  });
});

gulp.task('watch', function watchFiles() {
  gulp.watch('./src/app/**/*.js', ['js']);
  gulp.watch('./src/**/*.jade', ['jade']);
  gulp.watch('./src/assets/css/*.styl', ['stylus']);
});

gulp.task('default', ['clean', 'jade', 'stylus', 'img', 'lib-js', 'lib-css', 'favicon', 'js', 'font']);
gulp.task('dev', ['clean', 'jade', 'stylus', 'img', 'lib-js', 'lib-css', 'favicon', 'js', 'font', 'connect', 'watch']);