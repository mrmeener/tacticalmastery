'use strict';

	var gulp = require('gulp'),
      concat = require('gulp-concat'),
        // jade = require('gulp-jade'),
    connect = require('gulp-connect-php'),
      uglify = require('gulp-uglify'),
   minifyCss = require('gulp-minify-css'),
      rename = require('gulp-rename'),
        sass = require('gulp-ruby-sass'),
        maps = require('gulp-sourcemaps'),
         del = require('del'),
     compass = require('gulp-compass'),
     plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
 browserSync = require('browser-sync'),
autoprefixer = require('gulp-autoprefixer'),
        path = require('path');

//////////////////////////////////////////////////

gulp.task('browser-sync', function() {
  connect.server({}, function (){
    browserSync({
      proxy: 'localhost:8000'
    });
  });
 
  gulp.watch('**/*.php').on('change', function () {
    browserSync.reload();
  });
});

//////////////////////////////////////////////////

// gulp.task('compileJade', function() {
//   var YOUR_LOCALS = {};
 
//   gulp.src('./*.jade')
//     .pipe(jade({
//       locals: YOUR_LOCALS,
//       pretty: true
//     }))
//     .pipe(gulp.dest('./'))
//     .pipe(livereload())
//     .pipe(browserSync.stream());
// });

//////////////////////////////////////////////////

gulp.task("minifyScripts", function() {
	return gulp.src("scripts/*.js")
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('scripts/min'))
    .pipe(livereload())
    .pipe(browserSync.stream());
});

//////////////////////////////////////////////////

gulp.task('compileCompass', function() {
  gulp.src('./styles/sass/*.scss')
  	.pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: 'styles/css',
      sass: 'styles/sass'
    }))
    .pipe(minifyCss())
    .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
    .pipe(gulp.dest('styles/css'))
    .pipe(livereload())
    .pipe(browserSync.stream());
});

//////////////////////////////////////////////////

gulp.task('clean', function() {
	del(['dist', 'styles/css', 'scripts/min', 'scripts/all_scripts.js', 'scripts/all_scripts.js.map']);
});

//////////////////////////////////////////////////

gulp.task('watchFiles', function() {

	var server = livereload();

  gulp.start('browser-sync');

	gulp.watch('styles/sass/**/*.scss', ['compileCompass']);
	gulp.watch('scripts/*.js', ['minifyScripts']);
  // gulp.watch('*.jade', ['compileJade']);
  gulp.watch("*.html").on('change', browserSync.reload);
});

//////////////////////////////////////////////////

gulp.task("build", ['minifyScripts', 'compileCompass']);

//////////////////////////////////////////////////

gulp.task('serve', ['watchFiles']);

//////////////////////////////////////////////////

gulp.task("default", ["clean"], function() {
	gulp.start('build');
	gulp.start('serve');
});


