"use strict";
describe("time/computingState", () => {

    const segmentClass = require("../../src/time/segment");

    it("return start time correctly", () => {
        const start = {};
        let segment = segmentClass({
            start: start
        });

        expect(segment.start()).toBe(start);
    });

    it("return end time correctly", () => {
        const end = {};
        let segment = segmentClass({
            end: end
        });

        expect(segment.end()).toBe(end);
    });

    it("compute delta correctly", () => {
        const start = 1000;
        const end = 2000;
        let segment = segmentClass({
            start: start,
            end: end
        });

        expect(segment.delta()).toBe(1000);
    });
});
