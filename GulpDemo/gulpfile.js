const gulp = require("gulp");
const sass = require("gulp-sass");
const minifycss = require("gulp-minify-css");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const connect = require("gulp-connect");

//启动任务
gulp.task("hello", function(done) {
    console.log("hello world");
    done();
});

//整理.html文件
gulp.task("copy-html", function() {
    return gulp
        .src("index.html")
        .pipe(gulp.dest("dist/"))
        .pipe(connect.reload());
});
/*
      静态文件
      拷贝图片
     */
gulp.task("images", function() {
    return gulp
        .src("img/**/*")
        .pipe(gulp.dest("dist/images"))
        .pipe(connect.reload());
});
gulp.task("data", function() {
    return gulp
        .src(["json/*.json", "xml/*.xml", "!xml/04.xml"])
        .pipe(gulp.dest("dist/data"))
        .pipe(connect.reload());
});
//     gulp.watch(["json/*.json", "xml/*.xml", "!xml/04.xml"], async() => {

//         gulp.src(["json/*.json", "xml/*.xml", "!xml/04.xml"])

//         .pipe(gulp.dest("dist/data"));

//     });

// });

gulp.task("sass", function() {
    return gulp
        .src("stylesheet/index.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(minifycss())
        .pipe(rename("index.min.css"))
        .pipe(gulp.dest("dist/css"))
        .pipe(connect.reload());
});
gulp.task("scripts", function() {
    return gulp
        .src("javascript/*.js")
        .pipe(concat("index.js"))
        .pipe(gulp.dest("dist/js"))
        .pipe(uglify())
        .pipe(rename("index.min.js"))
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload());
});
gulp.task("watch", async function() {
    gulp.watch("index.html", async function(cb) {
        gulp.src("index.html").pipe(gulp.dest("dist/"));
        cb();
    });
    gulp.watch("img/**/*", async function(cb) {
        gulp.src("img/**/*")
            .pipe(gulp.dest("dist/images"))
            .pipe(connect.reload());
        cb();
    });
    gulp.watch(["json/*.json", "xml/*.xml", "!xml/04.xml"], function(cb) {
        gulp.src(["json/*.json", "xml/*.xml", "!xml/04.xml"]).pipe(
            gulp.dest("dist/data")
        );
        cb();
    });
    gulp.watch("javascript/*.js", async function(cb) {
        // gulp.src("javascript/*.js")
        //     .pipe(gulp.dest("dist/js"))
        gulp.src("javascript/*.js")
            .pipe(concat("index.js"))
            .pipe(gulp.dest("dist/js"))
            .pipe(uglify())
            .pipe(rename("index.min.js"))
            .pipe(gulp.dest("dist/js"))
            .pipe(connect.reload());

        cb();
    });
    gulp.watch("stylesheet/index.scss", async function(cb) {
        // gulp.src("stylesheet/index.scss")

        // .pipe(gulp.dest("dist/css"));
        gulp.src("stylesheet/index.scss")
            .pipe(sass())
            .pipe(gulp.dest("dist/css"))
            .pipe(minifycss())
            .pipe(rename("index.min.css"))
            .pipe(gulp.dest("dist/css"))
            .pipe(connect.reload());
        cb();
    });
});
gulp.task("server", function() {
    connect.server({
        root: "dist",
        port: 8888,
        livereload: true,
    });
});
gulp.task(
    "build",
    gulp.series("data", "images", "copy-html", "scripts", "sass", function(
        cb
    ) {
        cb();
    })
);
gulp.task(
    "default",
    gulp.series("watch", "server", function(cb) {
        cb();
    })
);