var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    path = require('path');


var paths = {
    'scripts': ['/src/gantt-chart.js'],
    'styles': ['/src/gantt-chart.less']
};


gulp.task('app-scripts', function() {
    return gulp.src(paths.scripts)
    .pipe(concat('gantt-chart.min.js'))
    .pipe(gulp.dest('dist/'));
});


gulp.task('app-styles', function () {
  return gulp.src(paths.styles)
    .pipe(concat('gantt-chart.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/'));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['app-scripts']);
  gulp.watch(paths.styles, ['app-styles']);
});


gulp.task('default', function() {
    'watch',
    'app-scripts',
    'app-styles'
});
