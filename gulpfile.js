"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");



gulp.task("style", function() {
  return gulp.src("static_dev/less/styles.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 version"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("eyeglasses/static/css"))
    .pipe(minify())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("eyeglasses/static/css"))
    //.pipe(server.reload({stream: true}))
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationlevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"))
})

gulp.task("serve", function() {
//  server.init({
//    server: {
//      baseDir: "build/"
//    }
//  });

  gulp.watch("static_dev/less/**/*.less", ["style"]);
  //gulp.watch("templates/*.html", ["copy-html"]);
  gulp.watch("static_dev/js/**/*.js", ["copy-js"]);
});

gulp.task("copy", function() {
  return gulp.src([
    "static_dev/fonts/**/*.{woff,woff2}",
    "static_dev/img/**",
    "static_dev/js/**",
    "templates/*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"))
  .pipe(server.reload({stream: true}))
});

gulp.task("copy-html", function() {
  return gulp.src([
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"))
  .pipe(server.reload({stream: true}))
});

gulp.task("copy-js", function() {
  return gulp.src([
    "static_dev/js/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"))
  //.pipe(server.reload({stream: true}))
});

gulp.task("copy-img", function() {
  return gulp.src([
    "img/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"))
  .pipe(server.reload({stream: true}))
});

gulp.task("clean", function() {
  return del("build/**/*");
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    fn
  );
})
