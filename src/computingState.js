"use strict";

function computingState(spec, my) {
    spec = spec || {};
    my = my || {};

    var that = {};

    my.accumulated = spec.accumulated || 0;
    my.startingTime = spec.startingTime;

    that.compute = (record) => {
        throw new Error("Should be overridden");
    };

    my.exit = () => {
        return my.accumulated;
    };

    return that;
}

module.exports = computingState;
