var gulp              = require('gulp');
var minifycss         = require('gulp-minify-css')
var removeSourcemaps  = require('gulp-remove-sourcemaps');
var rename            = require("gulp-rename");
const sass = require("gulp-sass")(require('sass'));
sass.compiler         = require('node-sass');
const twig = require('gulp-twig');
var htmlmin = require('gulp-htmlmin');
var concat            = require('gulp-concat');
const scripts_lib = './node_modules/bootstrap/dist/js/bootstrap.bundle.js';
const minify = require('gulp-minify');

gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(removeSourcemaps())
    .pipe(gulp.dest('./css'));
});

gulp.task('js', function () {
  return gulp.src(['./scripts/*.js', scripts_lib])
    .pipe(concat('main.js'))
    .pipe(removeSourcemaps())
    .pipe(gulp.dest('./js/'));
});

gulp.task('twig', function () {
  return gulp.src('./templates/*.twig')
    .pipe(twig())
    .pipe(gulp.dest('./compiled/'));
})


gulp.task('cssmin', function () {
  return gulp.src(['./css/style.css'])
    .pipe(minifycss({keepSpecialComments : 0}))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('jsmin', function () {
  return gulp.src('./js/main.js')
    .pipe(minify({
      compress: true
    }))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task('cssrename', function () {
  return gulp.src('./css/style.css')
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('minify-html', function() {
  return gulp.src('./compiled/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest('./'));
  });

gulp.task('build', gulp.series([
  'sass',
  'js',
  'cssmin',
  'jsmin',
  'twig',
  'minify-html'
]));

gulp.task('sass:watch', function () {
  gulp.watch([
    './scss/*.scss',
    './scss/**/*.scss',
    './templates/**/*.twig',
    './scripts/*.js',
  ], gulp.series(['build']));
});

gulp.task('default', gulp.series(['sass:watch']));