const moment = require("moment");

const yearBuilder = require("../../src/periods/yearBuilder");
const visitor = require("../helpers/periods/yearVisitor");

const firstDay = new Date("2016-01-01");

describe("periods/yearBuilder", function() {
    "use strict";

    let daysData = [];

    beforeEach(() => {
        daysData = [];
        for (let i = 0; i < 366; i++) {
            let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
            daysData.push(moment(newDate).format("YYYY-MM-DD"));
        }
    });

    it("builds a year correctly", () => {
        let year2016 = yearBuilder.build(daysData);

        expect(year2016.periodIndex()).toBe(2016);
    });

    it(": 2016 has 366 days", () => {
        let year2016 = yearBuilder.build(daysData);
        year2016.accept(visitor);

        expect(visitor.getNumberOfDays()).toBe(366);
    })
});
