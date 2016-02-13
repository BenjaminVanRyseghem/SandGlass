(function() {
    "use strict";

    const electron = require("electron");
    const app = electron.app;

    const tray = require("./tray");
    const menu = require("./menu");
    const tickler = require("./tickler");
    const repl = require("./repl");

    app.dock.hide();
    app.on("ready", init);
    app.on("window-all-closed", function(e) {
        e.preventDefault();
    });

    app.makeSingleInstance(() => {});

    function init() {
        initializeTray();
        repl.init();
        tickler.init();
    }

    function initializeTray() {
        let currentTray = tray.init();
        menu.init(currentTray);
    }
})();
