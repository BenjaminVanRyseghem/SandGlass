(function() {
    "use strict";

    const computingState = require("./computingState");
    const segment = require("./segment");

    function activeState(spec, my) {

        spec = spec || {};
        my = my || {};

        let that = computingState(spec, my);
        my.startingTime = spec.startingTime;

        that.compute = (record) => {
            if (record.action === "stop") {
                let newSegment = segment({
                    start: my.startingTime,
                    end: record.timestamp
                });

                my.segments.push(newSegment);

                return require("./inactiveState")({
                    segments: my.segments
                });
            }

            return that;
        };

        return that;
    }

    module.exports = activeState;
})();
