"use strict";
const moment = require("moment");

const helper = require("../../src/periods/helper");
const yearBuilder = require("../../src/periods/yearBuilder");

const date = "2016-10-17";

const firstDay = new Date("2016-09-01");

describe("periods/helper", () => {

    let daysData = [];

    beforeEach(() => {
        daysData = [];
        for (let i = 0; i < 91; i++) {
            let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
            daysData.push(moment(newDate).format("YYYY-MM-DD"));
        }
    });

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

    it("can gather broken weeks", () => {
        let year = yearBuilder.build(daysData);

        let rawWeeks = year.getMonths().reduce((acc, month) => {
            return acc.concat(month.getWeeks());
        }, []);

        let broken = rawWeeks.filter((week) => {
            return week.isBroken();
        });

        let gatheredWeeks = helper.gatherBrokenWeeks(broken);

        expect(Object.keys(gatheredWeeks)).toEqual(["35", "39", "44", "48"]);
        expect(gatheredWeeks["35"].length).toEqual(1);
        expect(gatheredWeeks["39"].length).toEqual(2);
        expect(gatheredWeeks["44"].length).toEqual(2);
        expect(gatheredWeeks["48"].length).toEqual(1);
    });

    it("can reunite 2 broken weeks into one plain week", () => {
        let year = yearBuilder.build(daysData);

        let rawWeeks = year.getMonths().reduce((acc, month) => {
            return acc.concat(month.getWeeks());
        }, []);

        let broken = rawWeeks.filter((week) => {
            return week.isBroken();
        });
        let gatheredWeeks = helper.gatherBrokenWeeks(broken);
        let reunitedWeek = helper.reuniteBrokenWeeks("39", gatheredWeeks["39"]);

        expect(reunitedWeek.periodIndex()).toEqual(39);
        expect(reunitedWeek.isBroken()).toEqual(false);
    });

    it("cannot reunite 1 broken week", () => {
        let year = yearBuilder.build(daysData);

        let rawWeeks = year.getMonths().reduce((acc, month) => {
            return acc.concat(month.getWeeks());
        }, []);

        let broken = rawWeeks.filter((week) => {
            return week.isBroken();
        });
        let gatheredWeeks = helper.gatherBrokenWeeks(broken);
        let reunitedWeek = helper.reuniteBrokenWeeks("35", gatheredWeeks["35"]);

        expect(reunitedWeek.isBroken()).toEqual(true);
    });

    it("can reunite all gathered weeks", () => {
        let year = yearBuilder.build(daysData);

        let rawWeeks = year.getMonths().reduce((acc, month) => {
            return acc.concat(month.getWeeks());
        }, []);

        let broken = rawWeeks.filter((week) => {
            return week.isBroken();
        });
        let gatheredWeeks = helper.gatherBrokenWeeks(broken);
        let reunitedWeeks = helper.reuniteGatheredBrokenWeeks(gatheredWeeks);

        expect(reunitedWeeks.length).toEqual(4);
        expect(reunitedWeeks[0].isBroken()).toEqual(true);
        expect(reunitedWeeks[1].isBroken()).toEqual(false);
        expect(reunitedWeeks[2].isBroken()).toEqual(false);
        expect(reunitedWeeks[3].isBroken()).toEqual(true);

        expect(reunitedWeeks[1].getDays().length).toEqual(7);
    });
});
