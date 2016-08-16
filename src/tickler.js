(function() {
    "use strict";

    function tickler() {

        let that = {};
        let my = {};

        let duration = 1000;
        let onTickCallbacks = [];
        let onStartCallbacks = [];
        let onStopCallbacks = [];
        let running = false;

        that.init = () => {
            let settings = require("./settings");
            if (settings.showTimerInTray() && require("./db").isRunningFor(settings.projectToShowInTray())) {
                that.start();
            }
        };

        that.onTick = (callback) => onTickCallbacks.push(callback);
        that.onStart = (callback) => onStartCallbacks.push(callback);
        that.onStop = (callback) => onStopCallbacks.push(callback);

        that.duration = () => {
            return duration;
        };

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
                running = false;
                my.applyOnStop();
            }
        };

        my.tick = () => {
            if (running) {
                my.applyOnTick();
                setTimeout(my.tick, duration);
            }
        };

        my.applyOnTick = () => {
            for (let callback of onTickCallbacks) {
                callback();
            }
        };

        my.applyOnStart = () => {
            for (let callback of onStartCallbacks) {
                callback();
            }
        };

        my.applyOnStop = () => {
            for (let callback of onStopCallbacks) {
                callback();
            }
        };

        return that;
    }

    module.exports = tickler();
})();
