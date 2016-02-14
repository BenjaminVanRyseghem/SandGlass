"use strict";

let gulp = require("gulp");
let sequence = require("run-sequence");
let del = require("del");
let merge = require("merge-stream");
let reporters = require("jasmine-reporters");

let packageInfo = require("./package.json");

let plugins = require("gulp-load-plugins")({
    rename: {
        "gulp-shell": "shell",
        "gulp-sass-lint": "sasslint",
        "gulp-concat": "concat",
        "gulp-cssnano": "cssnano",
        "gulp-eslint": "eslint",
        "gulp-jasmine": "jasmine",
        "gulp-download-electron": "electron",
        "gulp-jasmine-browser": "jasmineBrowser",
        "gulp-istanbul": "istanbul",
        "gulp-codacy": "codacy"
    }
});

// App options
let options = {
    name: packageInfo.name,
    app: `${packageInfo.name}.app`,
    dmg: `${packageInfo.name}-${packageInfo.version}.dmg`,
    icon: "./resources/img/SandGlass.icns",
    plist: "./Info.plist",
    bundle: "io.sandglass.www"
};

gulp.task("default", ["lint", "tests"]);

gulp.task("css", () => {
    let scssStream = gulp.src("./resources/s+(a|c)ss/*.s+(a|c)ss")
        .pipe(plugins.sass())
        .pipe(plugins.concat("scss-files.scss"));

    return merge(scssStream)
        .pipe(plugins.concat("sand-glass.css"))
        .pipe(plugins.cssnano())
        .pipe(gulp.dest("resources/css"));
});

gulp.task("sass-lint", () => {
    return gulp.src("./resources/s+(a|c)ss/**/*.s+(a|c)ss")
        .pipe(plugins.sasslint());
});

gulp.task("js-lint", () => {
    return gulp.src(["./src/**/*.js", "./tests/**/*.js", "./resources/src/**/*.js"])
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
});

gulp.task("lint", ["sass-lint", "js-lint"]);

// Tests

gulp.task("pre-test", () => {
    return gulp.src(["./src/**/*.js", "./resources/src/**/*.js"])
        .pipe(plugins.istanbul())
        .pipe(plugins.istanbul.hookRequire());
});

gulp.task("tests", ["pre-test"], () => {
    return gulp.src("./tests/**/*.js")
        .pipe(plugins.jasmine({
            reporter: new reporters.TerminalReporter()
        }))
        .pipe(plugins.istanbul.writeReports());
    // .pipe(plugins.istanbul.enforceThresholds({thresholds: {global: 90}}));
});

gulp.task("jasmine", () => {
    return gulp.src(["src/**/*.js", "./tests/**/*.js"])
        .pipe(plugins.jasmineBrowser.specRunner())
        .pipe(plugins.jasmineBrowser.server({port: 8888}));
});

// Coverage

gulp.task("basic-coverage", () => {
    return gulp.src("").pipe(plugins.shell("istanbul cover ./node_modules/.bin/jasmine --captureExceptions")
    );
});

gulp.task("coveralls", ["basic-coverage"], () => {
    return gulp.src("").pipe(plugins.shell("cat <%= info %> | <%= coveralls %>", {
            templateData: {
                info: "./coverage/lcov.info",
                coveralls: "./node_modules/coveralls/bin/coveralls.js"
            }
        })
    );
});

gulp.task("codacy", ["basic-coverage"], () => {
    return gulp
        .src(["./coverage/lcov.info"], {read: false})
        .pipe(plugins.codacy({
            token: process.env.CODACY_TOKEN
        }));
});

gulp.task("coverage", ["coveralls", "codacy"], () => {
    return gulp.src("").pipe(plugins.shell("rm -rf ./coverage"));
});

// Build

gulp.task("build", () => {
    return gulp.src("").pipe(plugins.shell([
        "rm -rf ./release",
        "mkdir -p <%= release %>",

        "cp -R <%= electron_app %> <%= release_app %>",
        "mv <%= release_electron %> <%= release_example %>",
        "mkdir -p <%= release_build %>",

        "mkdir -p <%= electron_asar %>",
        "cp -p ./*.* <%= electron_asar %>/",
        "cp -Rp ./src <%= electron_asar %>/src",
        "cp -Rp ./resources <%= electron_asar %>/resources",
        "mkdir -p <%= electron_asar %>/node_modules",
        "npm install --prefix <%= electron_asar %> --production &>/dev/null",
        "rm -rf <%= electron_asar %>/node_modules/electron-prebuilt",
        "rm -rf <%= electron_asar %>/node_modules/.bin",
        "asar pack <%= electron_asar %> app.asar",
        "mv app.asar <%= release_build %>/app.asar",
        "rm -rf <%= electron_asar %>",

        "cp <%= release_example_icon %> <%= release_electron_icon %>",
        "cp <%= release_example_plist %> <%= release_plist %>",

        "/usr/libexec/PlistBuddy -c \"Set :CFBundleVersion <%= release_version %>\" <%= release_plist %>",
        "/usr/libexec/PlistBuddy -c \"Set :CFBundleDisplayName <%= release_name %>\" <%= release_plist %>",
        "/usr/libexec/PlistBuddy -c \"Set :CFBundleName <%= release_name %>\" <%= release_plist %>",
        "/usr/libexec/PlistBuddy -c \"Set :CFBundleIdentifier <%= release_bundle %>\" <%= release_plist %>",
        "/usr/libexec/PlistBuddy -c \"Set :CFBundleExecutable <%= release_name %>\" <%= release_plist %>"
    ], {
        templateData: {
            electron_app: "./cache/Electron.app",
            electron_asar: "./asar",
            release: "./release/osx",
            release_app: `./release/osx/${options.app}`,
            release_build: `./release/osx/${options.app}/Contents/Resources`,
            release_electron: `./release/osx/${options.app}/Contents/MacOS/Electron`,
            release_example: `./release/osx/${options.app}/Contents/MacOS/${options.name}`,
            release_bin: `./release/osx/${options.app}/Contents/Frameworks/Electron Helper.app/Contents/MacOS`,
            release_example_icon: options.icon,
            release_electron_icon: `./release/osx/${options.app}/Contents/Resources/atom.icns`,
            release_plist: `./release/osx/${options.app}/Contents/Info.plist`,
            release_example_plist: options.plist,
            release_name: options.name,
            release_bundle: options.bundle,
            release_version: "1.0.0"
        }
    }));
});

gulp.task("download", (cb) => {
    plugins.electron({
        version: "0.36.5",
        outputDir: "cache"
    }, cb);
});

gulp.task("dmg", () => {
    return gulp.src("").pipe(plugins.shell([
        "rm -rf ./dist",
        "mkdir -p ./dist",
        "node_modules/.bin/appdmg ./appdmg.json <%= release_dmg %>"
    ], {
        templateData: {
            release_dmg: `./dist/${options.dmg}`
        }
    }));
});

gulp.task("mac", (cb) => {
    sequence("download", "build", "dmg", cb);
});

// Clean

gulp.task("clean", (cb) => {
    del([
        "dist",
        "build",
        "release"
    ], cb);
});
