const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const app = electron.app;

const settings = require("./settings");
const time = require("./time");

function menu() {
    "use strict";

    let that = {};
    let settingWindow = null;

    that.init = (tray) => {
        tray.on("click", () => {
            let menu = Menu.buildFromTemplate(buildMenuTemplate());
            tray.popUpContextMenu(menu);
        });
    };

    function buildMenuTemplate() {
        let items = [
            {
                label: "Settings",
                click: toggleSettings,
                accelerator: "CmdOrCtrl+,"
            },
            {
                label: "Quit SandGlass",
                click: quit,
                accelerator: "CmdOrCtrl+Q"
            }
        ];

        if (!settings.showTimerInTray()) {
            items.unshift({type: "separator"});
            items.unshift({
                label: getDurationFor(settings.projectToShowInTray()),
                type: "normal",
                enabled: false
            });
        }

        return items;
    }

    function getDurationFor(project) {
        let duration = time.getTodayDurationFor(project);
        return time.formatDuration(duration);
    }

    function toggleSettings() {
        if (settingWindow) {
            settingWindow.close();
        } else {
            settingWindow = new BrowserWindow({
                width: 800,
                height: 600,
                show: false
            });
            settingWindow.on("closed", function() {
                settingWindow = null;
            });

            settingWindow.on("close", function(event) {
                settingWindow = null;
            });

            settingWindow.loadURL(`file://${__dirname}/../resources/settings.html`);
            settingWindow.show();
            settingWindow.focus();
        }
    }

    function quit() {
        app.quit();
    }

    return that;
}

module.exports = menu();
