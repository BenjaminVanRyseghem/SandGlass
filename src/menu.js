(function() {
    "use strict";
    const electron = require("electron");
    const BrowserWindow = electron.BrowserWindow;
    const Menu = electron.Menu;
    const app = electron.app;

    const settings = require("./settings");
    const time = require("./time");

    function menu() {

        let that = {};
        let settingWindow = null;
        let dashboardWindow = null;

        that.init = (tray) => {
            tray.on("click", () => {
                let menu = Menu.buildFromTemplate(buildMenuTemplate());
                tray.popUpContextMenu(menu);
            });
        };

        function buildMenuTemplate() {
            let items = [
                {
                    label: "Dashboard",
                    click: showDashboard,
                    enabled: true
                },
                {
                    type: "separator"
                },
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
                return;
            }

            settingWindow = new BrowserWindow({
                width: 640,
                height: 378,
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
            settingWindow.webContents.on("did-finish-load", function() {
                settingWindow.webContents.executeJavaScript(`window.windowId = ${settingWindow.id};`);
                settingWindow.show();
            });

            settingWindow.focus();
        }

        function showDashboard() {
            if (dashboardWindow) {
                dashboardWindow.focus();
                return;
            }

            dashboardWindow = new BrowserWindow({
                width: 780,
                height: 590,
                show: false,
                resizable: false,
                center: true
            });

            dashboardWindow.on("closed", function() {
                dashboardWindow = null;
            });

            dashboardWindow.loadURL(`file://${__dirname}/../resources/dashboard.html`);
            dashboardWindow.openDevTools();
            dashboardWindow.webContents.on("did-finish-load", function() {
                dashboardWindow.webContents.executeJavaScript(`window.windowId = ${dashboardWindow.id};`);
                dashboardWindow.show();
            });

            dashboardWindow.focus();
        }

        function quit() {
            app.quit();
        }

        return that;
    }

    module.exports = menu();
})();
