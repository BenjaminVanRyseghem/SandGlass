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

            let days = daysData.map((identifier) => {
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
                periodIndex: currentYear.toString()
            });
        };

        that.buildMonthData = (days) => {
            let monthsData = {};

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
                    let previousYear = false;
                    if (parseInt(monthIndex, 10) === 1 && parseInt(weekIndex, 10) > 6) {
                        previousYear = true;
                    }

                    let weekData = monthData.weeks[weekIndex];
                    let yearToUse = previousYear ? currentYear - 1 : currentYear;

                    let broken = helper.isWeekBroken(weekIndex, yearToUse);
                    let classToUse = broken ? brokenWeekClass : weekClass;

                    if (previousYear) {
                        weeks.unshift(classToUse({
                            days: weekData,
                            periodIndex: weekIndex.toString()
                        }));
                    } else {
                        weeks.push(classToUse({
                            days: weekData,
                            periodIndex: weekIndex.toString()
                        }));
                    }
                });

                months.push(monthClass({
                    weeks: weeks,
                    periodIndex: monthIndex.toString()
                }));
            });

            return months;
        };

        return that;
    }

    module.exports = yearBuilder();
})();
