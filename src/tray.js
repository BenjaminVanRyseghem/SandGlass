(function() {
    "use strict";

    const electron = require("electron");
    const Tray = electron.Tray;

    const path = require("path");

    const settings = require("./settings");
    const time = require("./time");
    const tickler = require("./tickler");
    const db = require("./db");

    function tray() {

        let that = {};

        let dotted = true;
        let tray;

        that.init = () => {
            let pathToIcon = path.resolve(`${__dirname}/../resources/img/trayIconTemplate.png`);
            tray = new Tray(pathToIcon);
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
            initBlinkingTitle();
            tickler.onStart(() => dotted = true);
            tickler.onStop(() => that.updateTitle());

            that.updateTitle();
        }

        function initBlinkingTitle() {
            tickler.onTick(() => {
                if (settings.showTimerInTray()) {
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
                }
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

})();
