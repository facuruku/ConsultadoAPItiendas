'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
const jsdoc = require('gulp-jsdoc3');
const eslint = require('gulp-eslint');

sass.compiler = require('node-sass');


gulp.task('doc', function (cb) {
    gulp.src(['', './js/*.js'], {
            read: false
        })
        .pipe(jsdoc(cb));
});


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

gulp.task('eslint', function () {
    return gulp.src(['./js/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(['sass'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./css/*.scss", gulp.series(['sass']));
    gulp.watch("./index.html").on('change', browserSync.reload);
    gulp.watch("./js/*.js").on("change", browserSync.reload);
    gulp.watch("./js/*.js").on("change", gulp.series(['eslint']));
}));



gulp.task('default', gulp.series(['serve']));



