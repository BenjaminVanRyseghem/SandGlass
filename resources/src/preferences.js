(()=> {
    "use strict";

    const remote = require("remote");
    const settings = remote.require("../src/settings");
    const app = remote.require("electron");
    const BrowserWindow = app.BrowserWindow;
    const Dialog = app.dialog;

    $(document).ready(function() {
        initializeForm();
        initializeHooks();

        $(document).bind('keydown', 'meta+,', () => {
            window.close();
        });
    });

    function initializeForm() {
        let projectToShowInTray = settings.projectToShowInTray();
        let showTimerInTray = settings.showTimerInTray();
        let databaseFolder = settings.databaseFolder();

        if (showTimerInTray) {
            $("#showTimerInTray").attr({checked: true});
        }

        $("#projectToShowInTray").val(projectToShowInTray);
        $("#databaseFolder").get(0).innerText = `${databaseFolder}db.json`;
    }

    function initializeHooks() {
        $("#showTimerInTray").change(() => {
            let value = $("#showTimerInTray").is(':checked');
            settings.showTimerInTray(value);
        });

        $("#projectToShowInTray").keyup(() => {
            let value = $("#projectToShowInTray").val();
            settings.projectToShowInTray(value);
        });

        $("#change-db-folder").click(() => {
            let win = BrowserWindow.fromId(window.windowId);
            let newPath = Dialog.showOpenDialog(win, {
                properties: ['openDirectory']
            });

            if (newPath) {
                settings.databaseFolder(newPath[0]);
                $("#databaseFolder").get(0).innerText = `${settings.databaseFolder()}db.json`;
            }
        });
    }
})();
