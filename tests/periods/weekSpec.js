const moment = require("moment");

const yearBuilder = require("../../src/periods/yearBuilder");

describe("periods/week", () => {
    "use strict";

    let year2016;
    let week;

    beforeEach(() => {
        const firstDay = new Date("2016-01-01");
        let daysData = [];

        for (let i = 0; i < 366; i ++) {
            let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
            daysData.push(moment(newDate).format("YYYY-MM-DD"));
        }

        year2016 = yearBuilder.build(daysData);
        week = year2016.getMonths()[9].getWeeks()[2];
    });

    it("is broken", () => {
        expect(week.isBroken()).toBe(false);
    });

    it("can get the year", () => {
        expect(week.getYear()).toBe(year2016);
    });

    it("can get the months", () => {
        expect(week.getMonths()[0].periodIndex()).toBe(year2016.getMonths()[9].periodIndex());
        expect(week.getMonths().length).toBe(1);
    });

    it("can get the weeks", () => {
        expect(week.getWeeks()[0]).toBe(week);
        expect(week.getWeeks().length).toBe(1);
    });

    it("set the month should raise an error", () => {
        let setMonth = week.setMonth.bind(null, null);

        expect(setMonth).toThrowError(Error, "`my.month` has already been set!");
    });
});
