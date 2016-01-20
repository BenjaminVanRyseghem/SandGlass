"use strict";

const electron = require("electron");
const app = electron.app;

const tray = require("./tray");
const menu = require("./menu");
const settings = require("./settings");
const db = require("./db");

app.on("ready", init);

function init() {
    //db.start();
    //db.stop();
    //let time = require("./time");
    //
    //let duration = helper.getDurationFor(undefined, "2016-01-19");
    //console.log(helper.formatDuration(duration));
    initializeTray();

    //setTimeout(function() {
    //settings.showTimerInTray(false);
    //    setTimeout(function() {
    //        settings.showTimerInTray(false);
    //    }, 10000);
    //}, 2000);
}

app.on("open-url", urlHandler);

function urlHandler(event, url) {
    let args = url.split("://").pop().split("/");

    if (args[0] == "") {
        console.error("URLs should at least have one segment, `start` or `stop`");
    }

    switch (args[0].toLowerCase()) {
        case "start":
            db.start();
            break;
        case "stop":
            db.stop();
            break;
        default:
            console.error("First url segment should be `start` or `stop`");
    }
}

function initializeTray() {

    let currentTray = tray.init();
    menu.init(currentTray);

}
