function tickler() {
    "use strict";

    let that = {};
    let my = {};

    let duration = 1000;
    let onTick = [];
    let onStart = [];
    let onStop = [];
    let running = false;

    that.init = () => {
        let settings = require("./settings");
        if (settings.showTimerInTray() && require("./db").isRunningFor(settings.projectToShowInTray())) {
            that.start();
        }
    };

    that.onTick = (callback) => onTick.push(callback);
    that.onStart = (callback) => onStart.push(callback);
    that.onStop = (callback) => onStop.push(callback);

    that.isRunning = () => {
        return running;
    };

    that.start = () => {
        if (!running) {
            running = true;
            my.applyOnStart();
            my.tick();
        }
    };

    that.stop = () => {
        if (running) {
            my.applyOnStop();
            running = false;
        }
    };

    my.tick = () => {
        if (running) {
            my.applyOnTick();
            setTimeout(my.tick, duration);
        }
    };

    my.applyOnTick = () => {
        for (let callback of onTick) {
            callback.apply(null, []);
        }
    };

    my.applyOnStart = () => {
        for (let callback of onStart) {
            callback.apply(null, []);
        }
    };

    my.applyOnStop = () => {
        for (let callback of onStop) {
            callback.apply(null, []);
        }
    };

    return that;
}

module.exports = tickler();
