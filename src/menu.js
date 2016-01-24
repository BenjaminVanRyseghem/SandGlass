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
                label: "Preferences",
                click: toggleSettings,
                accelerator: "CmdOrCtrl+,",
                enabled: true
            },
            {
                label: "Quit SandGlass",
                click: quit,
                accelerator: "CmdOrCtrl+Q",
                enabled: true
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
                width: 540,
                height: 170,
                show: false,
                titleBarStyle: "hidden",
                resizable: false,
                center: true,
                transparent: true
            });
            settingWindow.on("closed", function() {
                settingWindow = null;
            });

            settingWindow.loadURL(`file://${__dirname}/../resources/preferences.html`);
            settingWindow.openDevTools();
            settingWindow.webContents.on('did-finish-load', function() {
                settingWindow.show();
            });
            settingWindow.focus();
        }
    }

    function quit() {
        app.quit();
    }

    return that;
}

module.exports = menu();
