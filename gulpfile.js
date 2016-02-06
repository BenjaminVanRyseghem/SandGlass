var gulp = require('gulp');
var sequence = require('run-sequence');
var del = require('del');
var merge = require('merge-stream');
var reporters = require('jasmine-reporters');

var $ = require('gulp-load-plugins')({
    rename: {
        'gulp-sass-lint': 'sasslint',
        'gulp-concat': 'concat',
        'gulp-cssnano': 'cssnano',
        'gulp-jshint': 'jshint',
        'gulp-jasmine': 'jasmine',
        'gulp-download-electron': 'electron',
        'gulp-jasmine-browser': 'jasmineBrowser'
    }
});

// App options
var options = {
    name: 'SandGlass',
    app: 'SandGlass.app',
    dmg: 'SandGlass-1.0.0.dmg',
    icon: './resources/img/sandGlass.icns',
    plist: './Info.plist',
    bundle: 'io.sandglass.www'
};

gulp.task('default', ['lint', 'tests']);

gulp.task('css', function() {
    var scssStream = gulp.src('./resources/s+(a|c)ss/*.s+(a|c)ss')
        .pipe($.sass())
        .pipe($.concat('scss-files.scss'));

    return merge(scssStream)
        .pipe($.concat('sand-glass.css'))
        .pipe($.cssnano())
        .pipe(gulp.dest('resources/css'));
});

gulp.task('sass-lint', function() {
    return gulp.src('./resources/s+(a|c)ss/**/*.s+(a|c)ss')
        .pipe($.sasslint());
});

gulp.task('js-lint', function() {
    return gulp.src(['./src/**/*.js', './tests/**/*.js', './resources/src/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('lint', ['sass-lint', 'js-lint']);

// Tests

gulp.task('tests', function() {
    return gulp.src('./tests/**/*.js')
        .pipe($.jasmine({
            reporter: new reporters.TerminalReporter()
        }));
});

gulp.task('jasmine', function() {
    return gulp.src(['src/**/*.js', './tests/**/*.js'])
        .pipe($.jasmineBrowser.specRunner())
        .pipe($.jasmineBrowser.server({port: 8888}));
});

// Build

gulp.task('build', function() {
    return gulp.src('').pipe($.shell([
        'rm -rf ./release',
        'mkdir -p <%= release %>',

        'cp -R <%= electron_app %> <%= release_app %>',
        'mv <%= release_electron %> <%= release_example %>',
        'mkdir -p <%= release_build %>',

        'mkdir -p <%= electron_asar %>',
        'cp ./*.* <%= electron_asar %>/',
        'cp -r ./src <%= electron_asar %>/src',
        'cp -r ./resources <%= electron_asar %>/resources',
        'mkdir -p <%= electron_asar %>/node_modules',
        'npm install --prefix <%= electron_asar %> --production &>/dev/null',
        'rm -rf <%= electron_asar %>/node_modules/electron-prebuilt',
        'rm -rf <%= electron_asar %>/node_modules/.bin',
        'asar pack <%= electron_asar %> app.asar',
        'mv app.asar <%= release_build %>/app.asar',
        'rm -rf <%= electron_asar %>',

        'cp <%= release_example_icon %> <%= release_electron_icon %>',
        'cp <%= release_example_plist %> <%= release_plist %>',

        '/usr/libexec/PlistBuddy -c "Set :CFBundleVersion <%= release_version %>" <%= release_plist %>',
        '/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName <%= release_name %>" <%= release_plist %>',
        '/usr/libexec/PlistBuddy -c "Set :CFBundleName <%= release_name %>" <%= release_plist %>',
        '/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier <%= release_bundle %>" <%= release_plist %>',
        '/usr/libexec/PlistBuddy -c "Set :CFBundleExecutable <%= release_name %>" <%= release_plist %>'
    ], {
        templateData: {
            electron_app: './cache/Electron.app',
            electron_asar: './asar',
            release: './release/osx',
            release_app: './release/osx/' + options.app,
            release_build: './release/osx/' + options.app + '/Contents/Resources',
            release_electron: './release/osx/' + options.app + '/Contents/MacOS/Electron',
            release_example: './release/osx/' + options.app + '/Contents/MacOS/' + options.name,
            release_bin: './release/osx/' + options.app + '"/Contents/Frameworks/Electron Helper.app/Contents/MacOS"',
            release_example_icon: options.icon,
            release_electron_icon: './release/osx/' + options.app + '/Contents/Resources/atom.icns',
            release_plist: './release/osx/' + options.app + '/Contents/Info.plist',
            release_example_plist: options.plist,
            release_name: options.name,
            release_bundle: options.bundle,
            release_version: '1.0.0'
        }
    }));
});

gulp.task('download', function(cb) {
    $.electron({
        version: '0.36.5',
        outputDir: 'cache'
    }, cb);
});

gulp.task('dmg', function() {
    return gulp.src('').pipe($.shell([
        'rm -rf ./dist',
        'mkdir -p ./dist',
        'node_modules/.bin/appdmg ./appdmg.json <%= release_dmg %>'
    ], {
        templateData: {
            release_dmg: './dist/' + options.dmg
        }
    }));
});

gulp.task('mac', function(cb) {
    sequence('download', 'build', 'dmg', cb);
});

// Clean

gulp.task('clean', function(cb) {
    del([
        'dist',
        'build',
        'release'
    ], cb);
});
