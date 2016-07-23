var gulp   = require('gulp');
var jade   = require('gulp-jade');
var stylus = require('gulp-stylus');
var copy   = require('gulp-copy');

gulp.task('jade', function buildHTML() {
  return gulp.src(['./src/index.jade', './src/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./public'));
});

gulp.task('stylus', function buildCSS() {
  return gulp.src('./src/assets/css/index.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('img', function copyImages() {
  return gulp.src(['./src/assets/img/*/*.png'])
    .pipe(copy('./public/assets/img', {
      prefix: 3
    }));
});

gulp.task('lib-js', function copyJSLibs() {
  return gulp.src([
    './src/assets/lib/angular/angular.js',
    './src/assets/lib/jquery/dist/jquery.js',
    './src/assets/lib/semantic/dist/semantic.js'
  ])
    .pipe(copy('./public/assets/lib', {prefix: 100}));
});

gulp.task('lib-css', function copyCSSLibs() {
  return gulp.src([
    './src/assets/lib/semantic/dist/semantic.css'
  ])
    .pipe(copy('./public/assets/css', {prefix: 100}));
});

gulp.task('favicon', function copyFavicon() {
  return gulp.src([
    './src/favicon.ico'
  ])
    .pipe(copy('./public', {prefix: 100}));
});

gulp.task('js', function copyJS() {
  return gulp.src([
    './src/app/**/**/*.js'
  ])
    .pipe(copy('./public', {prefix: 1}));
});

gulp.task('default', ['jade', 'stylus', 'img', 'lib-js', 'lib-css', 'favicon', 'js']);