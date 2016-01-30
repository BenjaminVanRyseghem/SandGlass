const moment = require("moment");

const helper = require("../../src/periods/helper");

const date = "2016-10-17";

describe("periods/helper", function() {
    "use strict";

    it("return the correct year index", () => {
        expect(helper.getYearIndex(date)).toBe(2016);
    });

    it("return the correct month index", () => {
        expect(helper.getMonthIndex(date)).toBe(10);
    });

    it("return the correct week index", () => {
        expect(helper.getWeekIndex(date)).toBe(42);
    });

    it("return the correct day index", () => {
        expect(helper.getDayIndex(date)).toBe(291);
    });

    it("tell that week 42 of 2016 is not broken", () => {
        expect(helper.isWeekBroken(42, 2016)).toBe(false);
    });

    it("tell that week 39 of 2016 is broken", () => {
        expect(helper.isWeekBroken(39, 2016)).toBe(true);
    });

    it("tell that isWeekBroken raise an error if week number is less or equal to 0", () => {
        let isWeekBroken = helper.isWeekBroken.bind(null, 0, 2016);

        expect(isWeekBroken).toThrowError(Error, "`weekNo` must be greater or equal to 1");
    });

    it("compute correct week range for a broken week", () => {
        let range = helper.getDateRangeOfWeek(39, 2016);

        expect(moment(range.start).format("YYYY-MM-DD")).toBe("2016-09-26");
        expect(moment(range.end).format("YYYY-MM-DD")).toBe("2016-10-02");
    });

    it("compute correct week range for a non-broken week", () => {
        let range = helper.getDateRangeOfWeek(42, 2016);

        expect(moment(range.start).format("YYYY-MM-DD")).toBe("2016-10-17");
        expect(moment(range.end).format("YYYY-MM-DD")).toBe("2016-10-23");
    });

    it("return the whole week days", () => {
        let days = helper.getWeekDays(42, 2016);

        expect(days.length).toBe(7);

        expect(days[0]).toBe("2016-10-17");
        expect(days[1]).toBe("2016-10-18");
        expect(days[2]).toBe("2016-10-19");
        expect(days[3]).toBe("2016-10-20");
        expect(days[4]).toBe("2016-10-21");
        expect(days[5]).toBe("2016-10-22");
        expect(days[6]).toBe("2016-10-23");
    });
});
