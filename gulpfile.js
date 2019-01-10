var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');

gulp.task('sass', function () {
  return gulp.src('public/src/SCSS/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('public/dist/CSS'));
});

gulp.task('compress', function() {
  return gulp.src('public/src/JS/*.js')
    .pipe(minify({}))
    .pipe(gulp.dest('public/dist/JS'));
});

gulp.task('default', gulp.parallel(gulp.parallel('sass', 'compress'), function a() {
  gulp.watch('public/src/SCSS/*.scss', gulp.series('sass'));
  gulp.watch('public/src/JS/*.js', gulp.series('compress'));
}));
