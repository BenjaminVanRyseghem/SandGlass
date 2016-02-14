const moment = require("moment");

const yearBuilder = require("../../src/periods/yearBuilder");

describe("periods/month", () => {
    "use strict";

    const firstDay = new Date("2016-01-01");
    let daysData = [];

    for (let i = 0; i < 366; i ++) {
        let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
        daysData.push(moment(newDate).format("YYYY-MM-DD"));
    }

    const year2016 = yearBuilder.build(daysData);
    const january = year2016.getMonths()[0];

    it("order of `getDays` is correct", () => {
        let days = january.getDays();

        expect(days.length).toBe(31);
        expect(days[0].identifier()).toBe("2016-01-01");
    });

    it("can get months", () => {
        expect(january.getMonths()[0]).toBe(january);
        expect(january.getMonths().length).toBe(1);
    });

    it("set the year should raise an error", () => {
        let setYear = january.setYear.bind(null, null);

        expect(setYear).toThrowError(Error, "`my.year` has already been set!");
    });
});
