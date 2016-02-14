const moment = require("moment");

const yearBuilder = require("../../src/periods/yearBuilder");

describe("periods/day", () => {
    "use strict";

    let year2016;
    let day;

    beforeEach(() => {
        const firstDay = new Date("2016-01-01");
        let daysData = [];

        for (let i = 0; i < 366; i ++) {
            let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
            daysData.push(moment(newDate).format("YYYY-MM-DD"));
        }

        year2016 = yearBuilder.build(daysData);
        day = year2016.getDays()[290];
    });

    it("order of `getDays` is correct", () => {
        expect(year2016.getDays()[290].identifier()).toBe("2016-10-17");
    });

    it("can get the year", () => {
        expect(day.getYear()).toBe(year2016);
    });

    it("can get the months", () => {
        expect(day.getMonths()[0]).toBe(year2016.getMonths()[9]);
        expect(day.getMonths().length).toBe(1);
    });

    it("can get the weeks", () => {
        expect(day.getWeeks()[0].periodIndex()).toBe("42");
        expect(day.getWeeks().length).toBe(1);
    });

    it("can get the days", () => {
        expect(day.getDays()[0]).toBe(day);
        expect(day.getDays().length).toBe(1);
    });

    it("set the week should raise an error", () => {
        let setWeek = day.setWeek.bind(null, null);

        expect(setWeek).toThrowError(Error, "`my.week` has already been set!");
    })
});
