"use strict";

const electron = require("electron");
const app = electron.app;
const Tray = electron.Tray;
const menu = require("./menu");

let tray = null;

app.on("ready", init);

function init() {
    //let db = require("./db");
    //let helper = require("./helper");
    //
    //let duration = helper.getDurationFor(undefined, "2016-01-19");
    //console.log(helper.formatDuration(duration));
    initializeTray();
}

app.on("open-url", urlHandler);

function urlHandler(event, url) {
    console.log("New Request");
    console.dir(event);
    console.dir(url);
}

function initializeTray() {
    tray = new Tray("./resources/trayIconTemplate.png");
    tray.setHighlightMode(false);

    menu.init(tray);
    tray.setTitle("00:00");
    blinkingTitle(true);
}

function blinkingTitle(dotted) {
    setTimeout(function() {
        if (dotted) {
            tray.setTitle("00 00");
        } else {
            tray.setTitle("00:00");
        }

        blinkingTitle(!dotted);
    }, 1000);
}
