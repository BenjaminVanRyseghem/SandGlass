(function() {
    "use strict";

    const db = require("./db");
    const timeComputer = require("./time/timeComputer");
    const helper = require("./periods/helper");

    const moment = require("moment");
    require("moment-duration-format");

    function time() {

        let that = {};

        that.getSegmentsForDay = (project, day) => {
            let records = db.getRecordsFor(project, day);

            if (!records.length) {
                return [];
            }

            if ((records[records.length - 1].action !== "stop")) {
                let date = moment(day).endOf("day");
                records.push({
                    action: "stop",
                    timestamp: date.valueOf(),
                    project: project
                });
            }

            return timeComputer.computeWorkingSegmentsFor(records);
        };

        /**
         * Used to get the worked time for a day once the day is over.
         * Otherwise, use `getTodayDurationFor`.
         *
         * @param {String} project Name of the project to track
         * @param {String} day Day to check
         */
        that.getDurationForDay = (project, day) => {
            let segments = that.getSegmentsForDay(project, day);

            if (!segments.length) {
                return moment.duration(0);
            }

            let ms = timeComputer.computeTimeFromSegments(segments);

            return moment.duration(ms);
        };

        that.getDurationForWeek = (project, weekNumber, year) => {
            let weekDays = helper.getWeekDays(weekNumber, year);

            let result = moment.duration();

            for (let day of weekDays) {
                let duration = that.getDurationForDay(project, day);
                result.add(duration);
            }

            return result;
        };

        that.getTodayDurationFor = (project) => {
            let day = that.formatDay(Date.now());

            return that.getDurationForDay(project, day);
        };

        that.formatDay = (timestamp) => {
            return moment(timestamp).format("YYYY-MM-DD");
        };

        that.formatTime = (time) => {
            return moment(time).format("HH:mm:ss");
        };

        that.formatDuration = (duration, options) => {
            duration = moment.duration(duration);

            let dotted = !(options && options.undotted);

            if (dotted) {
                return duration.format("hh:mm:ss", {
                    trim: false
                });
            } else {
                return duration.format("hh mm ss", {
                    trim: false
                });
            }
        };

        return that;
    }

    module.exports = time();
})();
