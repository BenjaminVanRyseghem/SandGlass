"use strict";
describe("timeComputer", () => {

    const timeComputer = require("../../src/time/timeComputer");

    it("raise an exception if the first record is not a start", () => {
        let records = [
            {
                action: "stop"
            }
        ];

        let computeWorkingTimeFor = timeComputer.computeWorkingTimeFor.bind(null, records);

        expect(computeWorkingTimeFor).toThrowError(Error, "The day should begin with a \"start\" record");
    });

    it("raise an exception if the last record is not a stop", () => {
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

    it("compute the time correctly", () => {
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

    it("compute the time correctly when pauses", () => {
        let duration = 1000;

        let records = [
            {
                action: "start",
                timestamp: 0
            },
            {
                action: "stop",
                timestamp: duration
            },
            {
                action: "start",
                timestamp: 2 * duration
            },
            {
                action: "stop",
                timestamp: 3 * duration
            }
        ];

        expect(timeComputer.computeWorkingTimeFor(records)).toBe(2 * duration);
    });

    it("compute the time correctly when multiple starts", () => {
        let duration = 1000;

        let records = [
            {
                action: "start",
                timestamp: 0
            },
            {
                action: "start",
                timestamp: duration
            },
            {
                action: "stop",
                timestamp: 2 * duration
            }
        ];

        expect(timeComputer.computeWorkingTimeFor(records)).toBe(2 * duration);
    });

    it("compute the time correctly when multiple stops", () => {
        let duration = 1000;

        let records = [
            {
                action: "start",
                timestamp: 0
            },
            {
                action: "stop",
                timestamp: duration
            },
            {
                action: "stop",
                timestamp: 2 * duration
            }
        ];

        expect(timeComputer.computeWorkingTimeFor(records)).toBe(duration);
    });
});
