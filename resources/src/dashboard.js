(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");

    const DashboardComponent = require("./src/components/DashboardComponent");

    jQuery(document).ready(()=> {
        ReactDOM.render(
            React.createElement(DashboardComponent, null),
            document.getElementById("container")
        );
    });

})();
