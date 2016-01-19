"use strict";

const computingState = require("./computingState");
const inactiveState = require("./inactiveState");

function activeState(spec, my) {
    spec = spec || {};
    my = my || {};

    var that = computingState(spec, my);

    that.compute = (record) => {
        if (record.action === "stop") {
            let delta = record.timestamp - my.startingTime;

            return inactiveState({
                accumulated: my.accumulated + delta,
                startingTime: record.timestamp
            });
        } else {
            return that;
        }
    };

    return that;
}

module.exports = activeState;
