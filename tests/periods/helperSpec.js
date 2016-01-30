const moment = require("moment");

const helper = require("../../src/periods/helper");

const date = "2016-10-17";

describe("periods/helper", function() {
    "use strict";

    it("return the correct month index", () => {
        expect(helper.getMonthIndex(date)).toBe(10);
    });

    it("return the correct week index", () => {
        expect(helper.getWeekIndex(date)).toBe(42);
    });

    it("return the correct day index", () => {
        expect(helper.getDayIndex(date)).toBe(291);
    });

    it("tells that week 42 of 2016 is not broken", () => {
        expect(helper.isWeekBroken(42, 2016)).toBe(false);
    });

    it("tells that week 39 of 2016 is broken", () => {
        expect(helper.isWeekBroken(39, 2016)).toBe(true);
    });

    it("tells that isWeekBroken raise an error if week number is less or equal to 0", () => {
        let isWeekBroken = helper.isWeekBroken.bind(null, 0, 2016);

        expect(isWeekBroken).toThrowError(Error, "`weekNo` must be greater or equal to 1");
    });

    it("computes correct week range for a broken week", () => {
        let range = helper.getDateRangeOfWeek(39, 2016);

        expect(moment(range.start).format("YYYY-MM-DD")).toBe("2016-09-26");
        expect(moment(range.end).format("YYYY-MM-DD")).toBe("2016-10-02");
    });

    it("computes correct week range for a non-broken week", () => {
        let range = helper.getDateRangeOfWeek(42, 2016);

        expect(moment(range.start).format("YYYY-MM-DD")).toBe("2016-10-17");
        expect(moment(range.end).format("YYYY-MM-DD")).toBe("2016-10-23");
    });
});
