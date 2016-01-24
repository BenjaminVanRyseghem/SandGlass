(()=> {
    "use strict";

    const remote = require("remote");
    const settings = remote.require("../src/settings");

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

        if (showTimerInTray) {
            $("#showTimerInTray").attr({checked: true});
        }

        $("#projectToShowInTray").val(projectToShowInTray);
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
    }
})();
