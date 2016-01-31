const computingState = require("./computingState");
const endState = require("./endState");

function inactiveState(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    let that = computingState(spec, my);

    that.compute = (record) => {
        if (record === null) {
            return endState({
                segments: my.segments
            });
        }

        if (record.action === "start") {
            return require("./activeState")({
                segments: my.segments,
                startingTime: record.timestamp
            });
        }

        return that;
    };

    return that;
}

module.exports = inactiveState;
