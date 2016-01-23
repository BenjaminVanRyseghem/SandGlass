const activeState = require("./activeState");

// This is a state machine
function timeComputer() {
    "use strict";

    let that = {};

    that.computeWorkingTimeFor = (records) => {
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

    return that;
}

module.exports = timeComputer();
