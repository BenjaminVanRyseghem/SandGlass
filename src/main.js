(function() {
    "use strict";

    const electron = require("electron");
    const app = electron.app;

    const tray = require("./tray");
    const menu = require("./menu");
    const tickler = require("./tickler");
    const settings = require("./settings");
    const time = require("./time");
    const notification = require("./notification");
    const repl = require("./repl");

    app.dock.hide();
    app.on("ready", init);
    app.on("window-all-closed", (e) => {
        e.preventDefault();
    });

    app.makeSingleInstance(() => {});

    function init() {
        initializeTray();
        repl.init();
        tickler.init();
        initializeNotification();
    }

    function initializeNotification() {
        tickler.onTick(() => {
            if (settings.notifyWhenReachingLimit()) {
                let dailyLimit = settings.dailyLimit();
                let limit = dailyLimit * 3600000; // hours to seconds
                let project = settings.projectToShowInTray();
                let duration = time.getTodayDurationFor(project);
                let ms = duration.asMilliseconds();
                let upperLimit = limit + tickler.duration();

                if (limit <= ms && ms < upperLimit) {
                    notification.inform("Limit reached", `You just reached the ${dailyLimit}h limit. Congratulations!`);
                }
            }
        });

        if (settings.notifyWhenReachingLimit()) {
            tickler.start();
        }
    }

    function initializeTray() {
        let currentTray = tray.init();
        menu.init(currentTray);
    }
})();
