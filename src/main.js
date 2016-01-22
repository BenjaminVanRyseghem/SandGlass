const electron = require("electron");
const app = electron.app;

const tray = require("./tray");
const menu = require("./menu");
//const urlHandler = require("./urlHandler");
const repl = require("./repl");

(() => {
    "use strict";

    app.dock.hide();
    app.on("ready", init);
    app.on("window-all-closed", function(e) {
        e.preventDefault();
    });

    //urlHandler.init();

    function init() {
        initializeTray();
        repl.init();
    }

    function initializeTray() {
        let currentTray = tray.init();
        menu.init(currentTray);
    }
})();

// Playground

//db.start();
//db.stop();
//let time = require("./time");
//
//let duration = helper.getDurationFor(undefined, "2016-01-19");
//console.log(helper.formatDuration(duration));

//setTimeout(function() {
//settings.showTimerInTray(false);
//    setTimeout(function() {
//        settings.showTimerInTray(false);
//    }, 10000);
//}, 2000);
