const electron = require("electron");
const Menu = electron.Menu;

function menu() {
    "use strict";

    let that = {};

    that.init = (tray) => {
        tray.on("click", () => {
            console.log('');
            let menu = Menu.buildFromTemplate(buildMenuTemplate());
            tray.popUpContextMenu(menu);
        });
    };

    function buildMenuTemplate() {
        return [
            {
                label: `${Math.random() * 100}:${Math.random() * 100}`,
                type: "normal",
                enabled: false
            },
            {type: 'separator'},
            {label: "Item2", type: "radio"},
            {label: "Item3", type: "radio", checked: true},
            {label: "Item4", type: "radio"}
        ];
    }

    return that;
}

module.exports = menu();
