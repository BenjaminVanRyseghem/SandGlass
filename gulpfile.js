var gulp = require('gulp');
var sequence = require('run-sequence');
var del = require('del');
var $ = require('gulp-load-plugins')({
    rename: {
        'gulp-download-electron': 'electron'
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

gulp.task('download', function(cb) {
    $.electron({
        version: '0.35.4',
        outputDir: 'cache'
    }, cb);
});

gulp.task('build', function() {
    return gulp.src('').pipe($.shell([
        'rm -rf ./release',
        'mkdir -p <%= release %>',
        'cp -R <%= electron_app %> <%= release_app %>',
        'mv <%= release_electron %> <%= release_example %>',
        'mkdir -p <%= release_build %> <%= release_build %>/build <%= release_modules %>',
        'cp ./*.* <%= release_build %>/',
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
            release: './release/osx',
            release_app: './release/osx/' + options.app,
            release_build: './release/osx/' + options.app + '/Contents/Resources/app',
            release_modules: './release/osx/' + options.app + '/Contents/Resources/app/node_modules',
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

gulp.task('clean', function(cb) {
    del([
        'dist',
        'build',
        'cache',
        'release'
    ], cb);
});

gulp.task('mac', function(cb) {
    sequence('download', 'build', 'dmg', cb);
});
