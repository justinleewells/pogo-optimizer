var gulp   = require('gulp');
var jade   = require('gulp-jade');
var stylus = require('gulp-stylus');

gulp.task('jade', function buildHTML() {
  return gulp.src('./src/*/*.jade')
    .pipe(jade());
});

gulp.task('default', ['jade']);