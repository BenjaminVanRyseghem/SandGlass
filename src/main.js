const electron = require("electron");
const app = electron.app;

const tray = require("./tray");
const menu = require("./menu");
const urlHandler = require("./urlHandler");

(() => {
    "use strict";

    app.on("ready", init);
    urlHandler.init();

    function init() {
        initializeTray();
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
