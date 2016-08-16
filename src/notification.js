(function() {
    "use strict";
    const electron = require("electron");
    const BrowserWindow = electron.BrowserWindow;

    let notification = () => {
        let that = {};

        that.inform = (title, body) => {
            let window = new BrowserWindow({
                width: 0,
                height: 0,
                x: 0,
                y: 0,
                frame: false,
                transparent: true,
                minimizable: false,
                maximizable: false,
                alwaysOnTop: true,
                skipTaskbar: true,
                titleBarStyle: "hidden",
                show: false
            });

            window.loadURL(`file://${__dirname}/../resources/notification.html`);
            window.webContents.on("did-finish-load", () => {
                window.webContents.send("setup", title, {body: body});
            });

            setTimeout(window.destroy, 10000); // Kill the notification after 10s.
        };

        return that;
    };

    module.exports = notification();
})();
