const { src, dest, series } = require("gulp");

function HTMLTask() {
  return src("src/*.html").pipe(dest("dist"));
}

function imagestask() {
  return src("src/images/*").pipe(dest("dist"));
}

function ScriptsTask() {
  return src("src/scripts/*").pipe(dest("dist"));
}

function stylesTask() {
  return src("src/styles/*").pipe(dest("dist"));
}

exports.default = series(HTMLTask, imagestask, ScriptsTask, stylesTask);
