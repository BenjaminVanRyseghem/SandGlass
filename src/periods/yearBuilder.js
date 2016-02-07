(function() {
    "use strict";

    const helper = require("./helper");

    function yearBuilder() {

        let that = {};

        that.buildYears = (daysData) => {
            let result = [];
            let years = {};

            // Gather all day per year
            for (let day of daysData) {
                let year = helper.getYearIndex(day);
                if (!years[year]) {
                    years[year] = [];
                }
                years[year].push(day);
            }

            let keys = Object.keys(years);

            for (let year of keys) {
                result.push(that.build(years[year]));
            }

            return result;
        };

        that.build = (daysData) => {
            let dayClass = require("./day");
            let yearClass = require("./year");

            let currentYear = helper.getYearIndex(daysData[0]);

            let days = daysData.map(function(identifier) {
                if (currentYear !== helper.getYearIndex(identifier)) {
                    throw new Error("All days should be part of the same year");
                }

                return dayClass({
                    identifier: identifier,
                    periodIndex: helper.getDayIndex(identifier).toString()
                });
            });

            let monthsData = that.buildMonthData(days);
            let months = that.linkPeriods(monthsData, currentYear);

            return yearClass({
                months: months,
                periodIndex: currentYear
            });
        };

        that.buildMonthData = (days) => {
            let monthsData = [];

            // group per months
            for (let day of days) {
                let identifier = day.identifier();
                let dayMonthIndex = helper.getMonthIndex(identifier);
                let dayWeekIndex = helper.getWeekIndex(identifier);

                if (!monthsData[dayMonthIndex]) {
                    monthsData[dayMonthIndex] = {
                        weeks: {}
                    };
                }

                let monthData = monthsData[dayMonthIndex];

                if (!monthData.weeks[dayWeekIndex]) {
                    monthData.weeks[dayWeekIndex] = [];
                }

                monthData.weeks[dayWeekIndex].push(day);
            }

            return monthsData;
        };

        that.linkPeriods = (monthsData, currentYear) => {
            let weekClass = require("./week");
            let brokenWeekClass = require("./brokenWeek");
            let monthClass = require("./month");

            let months = [];

            let keys = Object.keys(monthsData);
            keys.forEach((monthIndex) => {
                let monthData = monthsData[monthIndex];
                let weeks = [];

                let wKeys = Object.keys(monthData.weeks);
                wKeys.forEach((weekIndex) => {
                    let weekData = monthData.weeks[weekIndex];

                    let broken = helper.isWeekBroken(weekIndex, currentYear);
                    let classToUse = broken ? brokenWeekClass : weekClass;

                    weeks.push(classToUse({
                        days: weekData,
                        periodIndex: weekIndex
                    }));
                });

                months.push(monthClass({
                    weeks: weeks,
                    periodIndex: monthIndex
                }));
            });

            return months;
        };

        return that;
    }

    module.exports = yearBuilder();
})();
