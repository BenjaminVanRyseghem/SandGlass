const moment = require("moment");

const yearBuilder = require("../../src/periods/yearBuilder");

describe('periods/year', () => {
    "use strict";

    const firstDay = new Date("2016-01-01");
    let daysData = [];

    for (let i = 0; i < 366; i ++) {
        let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
        daysData.push(moment(newDate).format("YYYY-MM-DD"));
    }

    const year2016 = yearBuilder.build(daysData);

    it("order of `getDays` is correct", () => {
        let days = year2016.getDays();

        days.forEach((day, index) => {
            expect(day.identifier()).toBe(daysData[index]);
        });
    });

    it("can get the year", () => {
        expect(year2016.getYear()).toBe(year2016);
    });

    it("contains itself", () => {
        expect(year2016.containsYear("2016")).toBe(true);
    });

    it("can get the months", () => {
        expect(year2016.getMonths()[0].periodIndex()).toBe("1");
        expect(year2016.getMonths()[1].periodIndex()).toBe("2");
        expect(year2016.getMonths()[2].periodIndex()).toBe("3");
        expect(year2016.getMonths()[3].periodIndex()).toBe("4");
        expect(year2016.getMonths()[4].periodIndex()).toBe("5");
        expect(year2016.getMonths()[5].periodIndex()).toBe("6");
        expect(year2016.getMonths()[6].periodIndex()).toBe("7");
        expect(year2016.getMonths()[7].periodIndex()).toBe("8");
        expect(year2016.getMonths()[8].periodIndex()).toBe("9");
        expect(year2016.getMonths()[9].periodIndex()).toBe("10");
        expect(year2016.getMonths()[10].periodIndex()).toBe("11");
        expect(year2016.getMonths()[11].periodIndex()).toBe("12");
        expect(year2016.getMonths().length).toBe(12);
    });
});
