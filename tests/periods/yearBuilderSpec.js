const moment = require("moment");

const yearBuilder = require("../../src/periods/yearBuilder");
const visitorClass = require("../helpers/periods/yearVisitor");

const firstDay = new Date("2016-01-01");

Array.prototype.any = function(fn) {
    "use strict";
    for (let each of this) {
        if (fn(each)) {
            return true;
        }
    }
    return false;
};

describe("periods/yearBuilder", () => {
    "use strict";

    let daysData = [];
    let visitor = null;

    beforeEach(() => {
        daysData = [];
        for (let i = 0; i < 366; i++) {
            let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
            daysData.push(moment(newDate).format("YYYY-MM-DD"));
        }
    });

    beforeEach(() => {
        visitor = visitorClass();
    });

    it("builds a year correctly", () => {
        let year2016 = yearBuilder.build(daysData);

        expect(year2016.periodIndex()).toBe(2016);
    });

    it(": 2016 has 366 days", () => {
        let year2016 = yearBuilder.build(daysData);
        year2016.accept(visitor);

        expect(visitor.getNumberOfDays()).toBe(366);
    });

    it(": 2016 has 12 months", () => {
        let year2016 = yearBuilder.build(daysData);
        year2016.accept(visitor);

        expect(visitor.getNumberOfMonths()).toBe(12);
    });

    it(": 2016 has 54 weeks", () => {
        let year2016 = yearBuilder.build(daysData);
        visitor.visitWeeks(year2016);
        //year2016.accept(visitor);

        expect(visitor.getNumberOfUnbrokenWeeks()).toBe(52);

        // Very first week that can't be reunited
        expect(visitor.getNumberOfBrokenWeeks()).toBe(1);
    });

    it("builds years with incomplete data", () => {
        daysData = [];

        for (let i = 0; i < 366; i++) {

            // Only one day per week
            if (i % 7 === 0) {
                let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
                daysData.push(moment(newDate).format("YYYY-MM-DD"));
            }
        }

        let year2016 = yearBuilder.build(daysData);
        year2016.accept(visitor);

        expect(visitor.getNumberOfDays()).toBe(53);
    });

    describe("contains functions", () => {

        it(": year2016 contains 2016-03-04", () => {
            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsDay("2016-03-04")).toBe(true);
        });

        it(": year2016 doesn't contains 2017-03-04", () => {
            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsDay("2017-03-04")).toBe(false);
        });

        it(": year2016 contains month 2", () => {
            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsMonth("2")).toBe(true);
        });

        it(": year2016 doesn't contains month 22", () => {
            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsMonth("22")).toBe(false);
        });

        it(": truncated year 2016 doesn't contains month 2", () => {
            daysData = [];

            for (let i = 0; i < 366; i++) {
                let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);

                // All the year but Feb
                if (newDate.getMonth() !== 1) {
                    daysData.push(moment(newDate).format("YYYY-MM-DD"));
                }
            }

            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsMonth("2")).toBe(false);
        });

        it(": truncated year 2016 contains month 3", () => {
            daysData = [];

            for (let i = 0; i < 366; i++) {
                let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);

                // All the year but Feb
                if (newDate.getMonth() !== 1) {
                    daysData.push(moment(newDate).format("YYYY-MM-DD"));
                }
            }

            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsMonth("3")).toBe(true);
        });

        it(": truncated year 2016 doesn't contains week 6", () => {
            daysData = [];

            for (let i = 0; i < 366; i++) {
                let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);

                // All the year but Feb
                if (newDate.getMonth() !== 1) {
                    daysData.push(moment(newDate).format("YYYY-MM-DD"));
                }
            }

            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsWeek("6")).toBe(false);
        });

        it(": truncated year 2016 contains week 24", () => {
            daysData = [];

            for (let i = 0; i < 366; i++) {
                let newDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);

                // All the year but Feb
                if (newDate.getMonth() !== 1) {
                    daysData.push(moment(newDate).format("YYYY-MM-DD"));
                }
            }

            let year2016 = yearBuilder.build(daysData);

            expect(year2016.containsWeek("24")).toBe(true);
        });
    });
});
