(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");

    const IntervalSelection = require("./src/components/IntervalSelection");

    jQuery(document).ready(()=> {
        ReactDOM.render(
            React.createElement(IntervalSelection, null),
            document.getElementById("container")
        );
    });

})();
