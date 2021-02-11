'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

sass.compiler = require('node-sass');


// Compile sass into CSS & auto-inject into browserSync
gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('sass:watch', function(){
    gulp.watch('./css/*.scss', gulp.series(['sass']));
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(['sass'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./css/*.scss", gulp.series(['sass']));
    gulp.watch("./index.html").on('change', browserSync.reload);
    gulp.watch("./js/*.js").on("change", browserSync.reload);
}));

gulp.task('default', gulp.series(['serve']));
