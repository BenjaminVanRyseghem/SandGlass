(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");

    const remote = require("remote");
    const info = remote.require("../src/info");

    const DashboardComponent = require("./src/components/AboutComponent");

    jQuery(document).ready(()=> {
        document.title = `About ${info.name}`;

        ReactDOM.render(
            React.createElement(DashboardComponent, null),
            document.getElementById("container")
        );
    });

})();
