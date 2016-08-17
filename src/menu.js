(function() {
    "use strict";
    const electron = require("electron");
    const BrowserWindow = electron.BrowserWindow;
    const Menu = electron.Menu;
    const app = electron.app;

    const settings = require("./settings");
    const db = require("./db");
    const time = require("./time");
    const info = require("./info");
    const moment = require("moment");

    function menu() {

        let that = {};
        let settingWindow = null;
        let dashboardWindow = null;
        let aboutWindow = null;

        that.init = (tray) => {
            tray.on("click", () => {
                let menu = Menu.buildFromTemplate(buildMenuTemplate());
                tray.popUpContextMenu(menu);
            });
        };

        function buildMenuTemplate() {

            let startStopLabel = isRunningForCurrentProject() ? "Stop" : "Start";

            let items = [
                {
                    label: `${startStopLabel} the clock`,
                    click: toggleRunning,
                    enabled: true
                },
                {
                    type: "separator"
                },
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
                    label: `About ${info.name}`,
                    click: showAbout,
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
                let label = getDurationFor(settings.projectToShowInTray());

                if (settings.showRemainingTime()) {
                    label += ` (${getRemainingTime()} left)`;
                }

                items.unshift({type: "separator"});
                items.unshift({
                    label: label,
                    type: "normal",
                    enabled: false
                });
            } else {
                if (settings.showRemainingTime()) {

                    items.unshift({type: "separator"});
                    items.unshift({
                        label: `Remaining time: ${getRemainingTime()}`,
                        type: "normal",
                        enabled: false
                    });
                }
            }

            return items;
        }

        function getRemainingTime(project) {
            project = project || settings.projectToShowInTray();

            let limit = settings.dailyLimit();
            let limitDuration = moment.duration(limit, "hours");
            limitDuration.add(1, "seconds");
            limitDuration.subtract(time.getTodayDurationFor(project));
            return time.formatDuration(limitDuration);
        }

        function getDurationFor(project) {
            let duration = time.getTodayDurationFor(project);
            return time.formatDuration(duration);
        }

        function isRunningForCurrentProject() {
            let project = settings.projectToShowInTray();
            return db.isRunningFor(project);
        }

        function toggleRunning() {
            let project = settings.projectToShowInTray();
            if (isRunningForCurrentProject()) {
                db.stop(project);
            }
            else {
                db.start(project);
            }
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

            settingWindow.on("closed", () => {
                settingWindow = null;
            });

            settingWindow.loadURL(`file://${__dirname}/../resources/preferences.html`);
            settingWindow.webContents.on("did-finish-load", () => {
                settingWindow.webContents.executeJavaScript(`window.windowId = ${settingWindow.id};`);
                settingWindow.show();
            });

            settingWindow.focus();
        }

        function showAbout() {
            if (aboutWindow) {
                aboutWindow.focus();
                return;
            }

            aboutWindow = new BrowserWindow({
                width: 780,
                height: 600,
                show: false,
                resizable: false,
                center: true
            });

            aboutWindow.on("closed", () => {
                aboutWindow = null;
            });

            aboutWindow.loadURL(`file://${__dirname}/../resources/about.html`);
            aboutWindow.webContents.on("did-finish-load", () => {
                aboutWindow.webContents.executeJavaScript(`window.windowId = ${aboutWindow.id};`);
                aboutWindow.show();
            });

            aboutWindow.focus();
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

            dashboardWindow.on("closed", () => {
                dashboardWindow = null;
            });

            dashboardWindow.loadURL(`file://${__dirname}/../resources/dashboard.html`);
            dashboardWindow.webContents.on("did-finish-load", () => {
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
