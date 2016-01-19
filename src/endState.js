"use strict";

const computingState = require("./computingState");

function endState(spec, my) {
    spec = spec || {};
    my = my || {};

    var that = computingState(spec, my);

    that.getResult = () => {
        return my.accumulated;
    };

    return that;
}

module.exports = endState;
