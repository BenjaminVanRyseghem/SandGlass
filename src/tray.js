const electron = require("electron");
const Tray = electron.Tray;

const settings = require("./settings");
const time = require("./time");
const db = require("./db");

function tray() {
    "use strict";

    let that = {};

    let tray;

    that.init = () => {
        tray = new Tray("./resources/trayIconTemplate.png");
        tray.setHighlightMode(false);

        initTitle();

        return tray;
    };

    that.updateTitle = () => {
        initTitle();
    };

    function initTitle() {
        if (settings.showTimerInTray()) {
            tray.setTitle(getDurationFor(settings.projectToShowInTray()));
            blinkingTitle(true);
        }
    }

    function blinkingTitle(dotted) {
        setTimeout(function() {
            if (settings.showTimerInTray()) {
                let title = "";
                if (db.isRunningFor(settings.projectToShowInTray())) {
                    title = getDurationFor(settings.projectToShowInTray(), {
                        undotted: !dotted
                    });
                } else {
                    title = getDurationFor(settings.projectToShowInTray(), {
                        undotted: false
                    });
                }

                tray.setTitle(title);

                blinkingTitle(!dotted);
            } else {
                tray.setTitle("");
            }
        }, 1000);
    }

    function getDurationFor(project, options) {
        let undotted = options && options.undotted;
        let duration = time.getTodayDurationFor(project);
        return time.formatDuration(duration, {undotted: undotted});
    }

    return that;
}

module.exports = tray();
