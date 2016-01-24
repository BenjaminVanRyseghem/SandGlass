const ElectronSettings = require("electron-settings");
const path = require("path");
const fs = require("fs");

const tickler = require("./tickler");

function settings() {
    "use strict";

    let bridge = new ElectronSettings();

    let that = {};
    let my = {};

    that.showTimerInTray = (boolean) => {
        if (boolean === undefined) {
            return my.get("showTimerInTray");
        } else {
            let result = my.set("showTimerInTray", boolean);
            if (boolean && require("./db").isRunningFor(that.projectToShowInTray())) {
                tickler.start();
            }

            if (!boolean) {
                tickler.stop();
            }

            return result;
        }
    };

    that.projectToShowInTray = (project) => {
        if (project === undefined) {
            return my.get("projectToShowInTray") || "default";
        } else {
            let result = my.set("projectToShowInTray", project || undefined);
            require("./tray").updateTitle();
            if (require("./db").isRunningFor(project) && that.showTimerInTray()) {
                tickler.start();
            } else {
                tickler.stop();
            }

            return result;
        }
    };

    that.databaseFolder = (newPath) => {
        if (newPath === undefined) {
            let result = my.get("databaseFolder") || my.defaultDatabaseFolder();
            my.ensureSettingsFolderPath(result);
            if (result[result.length - 1] !== path.sep) {
                result += path.sep;
            }
            return result;
        } else {
            let oldPath = that.databaseFolder();
            let result = my.set("projectToShowInTray", newPath || undefined);
            my.ensureSettingsFolderPath(newPath);
            require("./db").migrate({
                from: oldPath,
                to: newPath
            });
            return result;
        }
    };

    my.set = (key, value, options) => {
        return bridge.set(key, value, options);
    };

    my.get = (key) => {
        return bridge.get(key);
    };

    my.unset = (key, options) => {
        return bridge.unset(key, options);
    };

    my.settingsPath = () => {
        return bridge.getUserConfigPath();
    };

    my.defaultDatabaseFolder = () => {
        let result = my.settingsPath();
        result = result.split(path.sep);
        result.pop();
        result.pop();
        result.push("database");

        result = result.join(path.sep) + path.sep;

        return result;
    };

    my.ensureSettingsFolderPath = (path) => {
        try {
            fs.accessSync(path, fs.F_OK);
        } catch (e) {
            fs.mkdirSync(path);
        }
    };

    return that;
}

module.exports = settings();
