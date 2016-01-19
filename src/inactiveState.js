"use strict";

const computingState = require("./computingState");
const activeState = require("./activeState");
const endState = require("./endState");

function inactiveState(spec, my) {
    spec = spec || {};
    my = my || {};

    var that = computingState(spec, my);

    that.compute = (record) => {
        if (record === null) {
            return endState({
                accumulated: my.accumulated
            });
        }

        if (record.action === "start") {
            return activeState({
                accumulated: my.accumulated,
                startingTime: record.timestamp
            });
        }

        return that;
    };

    return that;
}

module.exports = inactiveState;
