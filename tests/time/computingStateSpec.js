"use strict";
describe("time/computingState", () => {

    const computingState = require("../../src/time/computingState");
    const segments = {};
    const my = {};

    let state;

    beforeEach(() => {
        state = computingState({
            segments: segments
        }, my);
    });

    it("can not compute", () => {
        expect(state.compute).toThrowError(Error, "Should be overridden");
    });

    it("can not compute", () => {
        expect(my.exit()).toBe(segments);
    });
});
