const moment = require("moment");

function helper() {
    "use strict";

    let that = {};

    that.getMonthIndex = (data) => {
        return +moment(data).format("M");
    };

    that.getWeekIndex = (data) => {
        return +moment(data).format("W");
    };

    that.getYearIndex = (data) => {
        return +moment(data).format("YYYY");
    };

    that.getDayIndex = (data) => {
        return +moment(data).format("DDD");
    };

    that.isWeekBroken = (weekNo, year) => {
        var week = that.getDateRangeOfWeek(weekNo, year);
        var start = week.start;
        var end = week.end;
        return start.getMonth() !== end.getMonth();
    };

    // From https://gist.github.com/Abhinav1217/5038863
    that.getDateRangeOfWeek = (weekNo, year) => {
        if (weekNo < 1) {
            throw new Error("`weekNo` must be greater or equal to 1");
        }

        let date = new Date(year + "-02-03");

        let numOfdaysPastSinceLastMonday = date.getDay() - 1;
        date.setDate(date.getDate() - numOfdaysPastSinceLastMonday);

        let weekNoToday = that.getWeekIndex(date);
        let weeksInTheFuture = weekNo - weekNoToday;
        date.setDate(date.getDate() + 7 * weeksInTheFuture);

        return {
            start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6)
        };
    };

    that.getWeekDays = function(weekNumber, year) {
        let start = that.getDateRangeOfWeek(weekNumber, year).start;
        let days = [];

        for (let i = 0; i < 7; i++) {
            let day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
            days.push(moment(day).format("YYYY-MM-DD"));
        }

        return days;
    };

    return that;
}

module.exports = helper();
