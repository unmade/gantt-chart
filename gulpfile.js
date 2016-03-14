var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');


var paths = {
    'scripts': ['src/gantt-chart.js'],
    'styles': ['src/gantt-chart.less']
};


gulp.task('app-scripts', function() {
    return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('gantt-chart.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});


gulp.task('app-styles', function () {
  return gulp.src(paths.styles)
    .pipe(less())
    .pipe(minifyCss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('dist/'));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['app-scripts']);
  gulp.watch(paths.styles, ['app-styles']);
});


gulp.task('default', [
    'watch',
    'app-scripts',
    'app-styles'
]);
