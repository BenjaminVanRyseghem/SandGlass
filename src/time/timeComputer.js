(function() {
    "use strict";
    const activeState = require("./activeState");

    function timeComputer() {

        let that = {};

        that.computeWorkingSegmentsFor = (records) => {
            if ((records[0].action !== "start")) {
                throw new Error("The day should begin with a \"start\" record");
            }

            if ((records[records.length - 1].action !== "stop")) {
                throw new Error("The day should end with a \"stop\" record");
            }

            // Append `null` at the end as ending flag, and remove the head
            // as the iteration can start on the second element
            let allRecords = records.slice(1);
            allRecords.push(null);

            let currentState = activeState({
                startingTime: records[0].timestamp
            });

            for (let each of allRecords) {
                currentState = currentState.compute(each);
            }

            return currentState.getResult();
        };

        that.computeWorkingTimeFor = (records) => {
            let segments = that.computeWorkingSegmentsFor(records);

            return that.computeTimeFromSegments(segments);
        };

        that.computeTimeFromSegments = function(segments) {
            //console.log(segments);

            return segments.reduce((previous, current)=> {
                return previous + current.delta();
            }, 0);
        };

        return that;
    }

    module.exports = timeComputer();
})();
