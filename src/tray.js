const electron = require("electron");
const Tray = electron.Tray;

const settings = require("./settings");
const time = require("./time");
const tickler = require("./tickler");
const db = require("./db");

function tray() {
    "use strict";

    let that = {};

    let dotted = true;
    let tray;

    that.init = () => {
        tray = new Tray("./resources/img/trayIconTemplate.png");
        tray.setHighlightMode(false);

        initTitle();

        return tray;
    };

    that.updateTitle = () => {
        if (!tickler.isRunning() && settings.hideWhenStopped()) {
            hideTitle();
            return;
        }

        if (settings.showTimerInTray()) {
            setDottedDurationTitle();
        } else {
            hideTitle();
        }
    };

    function hideTitle() {
        tray.setTitle("");
    }

    function setDottedDurationTitle() {
        let project = settings.projectToShowInTray();
        let title = getDurationFor(project, {
            undotted: false
        });

        tray.setTitle(title);
    }

    function initTitle() {
        iniBblinkingTitle();
        tickler.onStart(() => dotted = true);
        tickler.onStop(() => that.updateTitle());

        that.updateTitle();
    }

    function iniBblinkingTitle() {
        tickler.onTick(() => {
            let title = "";
            let project = settings.projectToShowInTray();

            if (db.isRunningFor(project)) {
                title = getDurationFor(project, {
                    undotted: !dotted
                });
            } else {
                title = getDurationFor(project, {
                    undotted: false
                });
            }

            tray.setTitle(title);

            dotted = !dotted;
        });
    }

    function getDurationFor(project, options) {
        let undotted = options && options.undotted;
        let duration = time.getTodayDurationFor(project);
        return time.formatDuration(duration, {undotted: undotted});
    }

    return that;
}

module.exports = tray();
