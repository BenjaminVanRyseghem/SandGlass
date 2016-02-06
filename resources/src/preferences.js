(()=> {
    "use strict";

    const json2csv = require("json2csv");
    const remote = require("remote");
    const app = remote.require("electron");
    const BrowserWindow = app.BrowserWindow;
    const Dialog = app.dialog;

    const fs = remote.require("fs");
    const settings = remote.require("../src/settings");

    const db = remote.require("../src/db");

    $(document).ready(function() {
        initializeForm();
        initializeHooks();

        $(document).bind("keydown", "meta+,", () => {
            window.close();
        });
    });

    function initializeForm() {
        let projectToShowInTray = settings.projectToShowInTray();
        let showTimerInTray = settings.showTimerInTray();
        let hideWhenStopped = settings.hideWhenStopped();
        let databaseFolder = settings.databaseFolder();

        if (showTimerInTray) {
            $("#showTimerInTray").attr({checked: true});
        }

        if (hideWhenStopped) {
            $("#hideWhenStopped").attr({checked: true});
        }

        $("#projectToShowInTray").val(projectToShowInTray);
        $("#databaseFolder").get(0).innerText = `${databaseFolder}db.json`;
    }

    function initializeHooks() {
        $("#showTimerInTray").change(() => {
            let value = $("#showTimerInTray").is(":checked");
            settings.showTimerInTray(value);
        });

        $("#hideWhenStopped").change(() => {
            let value = $("#hideWhenStopped").is(":checked");
            settings.hideWhenStopped(value);
        });

        $("#projectToShowInTray").keyup(() => {
            let value = $("#projectToShowInTray").val();
            settings.projectToShowInTray(value);
        });

        $("#change-db-folder").click(() => {
            let win = BrowserWindow.fromId(window.windowId);
            let newPath = Dialog.showOpenDialog(win, {
                properties: ["openDirectory"]
            });

            if (newPath) {
                settings.databaseFolder(newPath[0]);
                $("#databaseFolder").get(0).innerText = `${settings.databaseFolder()}db.json`;
            }
        });

        $("#exportToCSV").click(() => {
            let win = BrowserWindow.fromId(window.windowId);
            let newPath = Dialog.showSaveDialog(win, {
                filters: [
                    {name: "Comma Separated Value", extensions: ["csv"]},
                    {name: "All Files", extensions: ["*"]}
                ]
            });

            if (newPath) {
                console.log(newPath);
                let data = db.getAllData();
                let csv = json2csv({
                    data: data
                }, (err, csv) => {
                    if (err) {
                        Dialog.showErrorBox("CSV Export", `The CSV export failed. The exact error was: \n\n${err}`);
                    } else {
                        fs.writeFileSync(newPath, csv, "utf8");
                    }
                });
            }
        });
    }
})();
