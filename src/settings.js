const ElectronSettings = require("electron-settings");
const path = require("path");
const fs = require("fs");

function settings() {
    "use strict";

    let bridge = new ElectronSettings();

    let that = {};
    let my = {};

    that.showTimerInTray = (boolean) => {
        if (boolean === undefined) {
            return my.get("showTimerInTray");
        } else {
            var result = my.set("showTimerInTray", boolean);
            require("./tray").updateTitle();
            return result;
        }
    };

    that.projectToShowInTray = () => {
        return undefined;
    };

    that.settingsPath = () => my.settingsPath();

    that.ensureSettingsFolderPath = () => {
        let result = that.settingsPath();
        result = result.split(path.sep);
        result.pop();
        result.pop();
        result.push("database");

        result = result.join(path.sep) + path.sep;

        try {
            fs.accessSync(result, fs.F_OK);
        } catch (e) {
            fs.mkdirSync(result);
        }

        return result;
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

    return that;
}

module.exports = settings();
