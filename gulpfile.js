const { src, dest, watch, series, parallel } = require("gulp");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const image = require("gulp-image");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
let uglify = require("gulp-uglify-es").default;
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const webp = require("gulp-webp");

const path = {
  dist: {
    html: "dist/",
    js: "dist/js/",
    css: "dist/css/",
    img: "dist/img/",
    fonts: "dist/fonts/",
    other: "dist/",
  },
  source: {
    html: "src/*.html",
    js: "src/js/*.js",
    scss: "src/styles/",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    other: "src/*.*",
  },
  watch: {
    html: "src/*.html",
    js: "src/js/*.js",
    scss: "src/styles/**/*.*",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    other: "src/*.*",
  },
};

function htmlTask() {
  return src(path.source.html)
    .pipe(dest(path.dist.html))
    .pipe(browserSync.stream());
}

function scssTask() {
  return src(path.source.scss + "*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write("./maps"))
    .pipe(dest(path.dist.css))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src([path.source.js])
      .pipe(sourcemaps.init())
      .pipe(concat("main.js"))
      .pipe(uglify())
      .pipe(sourcemaps.write("./maps"))
      .pipe(dest(path.dist.js))
      .pipe(browserSync.stream());
}

function imgTask() {
  return (
    src(path.source.img)
      .pipe(dest(path.dist.img))
      .pipe(webp())
      .pipe(image())
      .pipe(dest(path.dist.img))
      .pipe(browserSync.stream())
  );
}
function imgOptimizeTask() {
  return (
    src(path.source.img)
      .pipe(image())
      .pipe(webp())
      .pipe(dest(path.dist.img))
      .pipe(browserSync.stream())
  );
}

function watchTask() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
  watch(
    [path.source.html, path.source.scss, path.source.js, path.source.img],
    parallel(htmlTask, scssTask, jsTask, imgTask)
  ).on("change", browserSync.reload);
}

exports.build = series(parallel(htmlTask, scssTask, jsTask, imgOptimizeTask));
exports.serve = series(
  parallel(htmlTask, scssTask, jsTask, imgTask),
  watchTask
);
