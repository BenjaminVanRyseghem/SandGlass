const moment = require("moment");

function yearBuilder() {
    "use strict";

    let that = {};

    that.build = (daysData) => {
        let dayClass = require("./day");
        let weekClass = require("./week");
        let brokenWeekClass = require("./brokenWeek");
        let monthClass = require("./month");
        let yearClass = require("./year");

        let currentYear = new Date(daysData[0]).getFullYear();

        let days = daysData.map(function(identifier) {
            return dayClass({
                identifier: identifier,
                periodIndex: moment(identifier).format("YYYY-MM-DD")
            });
        });

        let monthsData = [];

        // group per months
        for (let day of days) {
            let data = day.identifier();
            let dayMonthIndex = +moment(data).format("M");
            let dayWeekIndex = +moment(data).format("w");
            let dayIndex = +moment(data).format("D");

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

        let months = [];

        let keys = Object.keys(monthsData);
        keys.forEach((monthIndex) => {
            let monthData = monthsData[monthIndex];
            let weeks = [];

            let wKeys = Object.keys(monthData.weeks);
            wKeys.forEach((weekIndex) => {
                let weekData = monthData.weeks[weekIndex];

                let broken = isWeekBroken(weekIndex, currentYear);
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

        return yearClass({
            months: months,
            periodIndex: currentYear
        });
    };

    function isWeekBroken(weekNo, year) {
        var week = getDateRangeOfWeek(weekNo, year);
        var start = week.start;
        var end = week.end;
        return start.getMonth() !== end.getMonth();
    }

    // From https://gist.github.com/Abhinav1217/5038863
    function getDateRangeOfWeek(weekNo, year) {
        if (weekNo < 1) {
            throw new Error("`weekNo` must be greater or equal to 1");
        }

        let date = new Date(year + "-02-03");

        let numOfdaysPastSinceLastMonday = date.getDay() - 1;
        date.setDate(date.getDate() - numOfdaysPastSinceLastMonday);

        let weekNoToday = +moment(date).format("W");
        let weeksInTheFuture = weekNo - weekNoToday;
        date.setDate(date.getDate() + 7 * weeksInTheFuture);

        return {
            start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6)
        };
    }

    return that;
}

module.exports = yearBuilder();
