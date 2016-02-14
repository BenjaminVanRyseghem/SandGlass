(function() {
    "use strict";

    const moment = require("moment");

    function helper() {

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
            let week = that.getDateRangeOfWeek(weekNo, year);
            let start = week.start;
            let end = week.end;
            return start.getMonth() !== end.getMonth();
        };

        // From https://gist.github.com/Abhinav1217/5038863
        that.getDateRangeOfWeek = (weekNo, year) => {
            if (weekNo < 1) {
                throw new Error("`weekNo` must be greater or equal to 1");
            }

            let date = new Date(`${year}-02-03`);

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

        that.gatherBrokenWeeks = function(brokenWeeks) {
            let result = {};

            for (let week of brokenWeeks) {
                let index = week.periodIndex();

                if (!result[index]) {
                    result[index] = [];
                }

                result[index].push(week);
            }

            return result;
        };

        that.reuniteGatheredBrokenWeeks = (data) => {
            let indexes = Object.keys(data);

            return indexes.map((index) => {
                return that.reuniteBrokenWeeks(index, data[index]);
            });
        };

        that.reuniteBrokenWeeks = (index, brokenWeeks) => {
            if (brokenWeeks.length === 1) {

                // Can't be reunited
                return brokenWeeks[0];
            }

            let days = brokenWeeks.reduce((previous, current) => {
                return previous.concat(current.getDays());
            }, []);

            days = days.map((day) => {
                return day.clone();
            });

            return require("./week")({
                periodIndex: +index,
                days: days
            });
        };

        return that;
    }

    module.exports = helper();
})();
