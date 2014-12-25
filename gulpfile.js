var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', ['test']);

gulp.task('test', function() {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('test:functional', function() {
  return gulp.src('test/functional/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('test:unit', function() {
  return gulp.src('test/unit/*.js', {read: false})
    .pipe(mocha());
});