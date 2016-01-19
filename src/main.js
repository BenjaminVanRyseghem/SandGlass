'use strict';

const electron = require('electron');
const app = electron.app;

app.on('ready', init);

function init() {
    let db = require("./db");
    let helper = require("./helper");

    let duration = helper.getDurationFor(undefined, "2016-01-19");
    console.log(helper.formatDuration(duration));
    //db.start();
    //setTimeout(() => {
    //    db.stop();
    //}, 1000);
}

app.on('open-url', startClockHandler);

function startClockHandler(event, url) {
    console.log('New Request');
    console.dir(event);
    console.dir(url);
}
