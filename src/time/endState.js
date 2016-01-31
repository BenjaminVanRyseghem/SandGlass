const computingState = require("./computingState");

function endState(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    let that = computingState(spec, my);

    that.getResult = () => {
        return my.segments;
    };

    return that;
}

module.exports = endState;
