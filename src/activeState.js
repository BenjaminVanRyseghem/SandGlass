const computingState = require("./computingState");

function activeState(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    let that = computingState(spec, my);

    that.compute = (record) => {
        if (record.action === "stop") {
            let delta = record.timestamp - my.startingTime;

            return require("./inactiveState")({
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
