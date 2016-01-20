const electron = require("electron");
const Menu = electron.Menu;

const settings = require("./settings");
const time = require("./time");

function menu() {
    "use strict";

    let that = {};

    that.init = (tray) => {
        tray.on("click", () => {
            let menu = Menu.buildFromTemplate(buildMenuTemplate());
            tray.popUpContextMenu(menu);
        });
    };

    function buildMenuTemplate() {
        if (settings.showTimerInTray()) {
            return [
                {label: "Item2", type: "radio"},
                {label: "Item3", type: "radio", checked: true},
                {label: "Item4", type: "radio"}
            ];
        } else {
            return [
                {
                    label: getDurationFor(settings.projectToShowInTray()),
                    type: "normal",
                    enabled: false
                },
                {type: 'separator'},
                {label: "Item2", type: "radio"},
                {label: "Item3", type: "radio", checked: true},
                {label: "Item4", type: "radio"}
            ];
        }
    }

    function getDurationFor(project) {
        let duration = time.getTodayDurationFor(project);
        return time.formatDuration(duration);
    }

    return that;
}

module.exports = menu();
