describe("timeComputer", function() {
    "use strict";

    const timeComputer = require("../src/time/timeComputer");

    it("raise an exception if the first record is not a start", function() {
        let records = [
            {
                action: "stop"
            }
        ];

        let computeWorkingTimeFor = timeComputer.computeWorkingTimeFor.bind(null, records);

        expect(computeWorkingTimeFor).toThrowError(Error, "The day should begin with a \"start\" record");
    });

    it("raise an exception if the last record is not a stop", function() {
        let records = [
            {
                action: "start"
            },
            {
                action: "start"
            }
        ];

        let computeWorkingTimeFor = timeComputer.computeWorkingTimeFor.bind(null, records);

        expect(computeWorkingTimeFor).toThrowError(Error, "The day should end with a \"stop\" record");
    });

    it("compute the time correctly", function() {
        let duration = 1000;

        let records = [
            {
                action: "start",
                timestamp: 0
            },
            {
                action: "stop",
                timestamp: duration
            }
        ];

        expect(timeComputer.computeWorkingTimeFor(records)).toBe(duration);
    });
});
