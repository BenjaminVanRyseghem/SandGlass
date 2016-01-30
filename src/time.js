const db = require("./db");
const timeComputer = require("./timeComputer");
const moment = require("moment");
require("moment-duration-format");

function time() {
    "use strict";

    let that = {};

    /**
     * Used to get the worked time for a day once the day is over.
     * Otherwise, use `getTodayDurationFor`.
     *
     * @param {String} project Name of the project to track
     * @param {String} day Day to check
     */
    that.getDurationForDay = (project, day) => {
        let records = db.getRecordsFor(project, day);

        if (!records.length) {
            return moment.duration(0);
        }

        if ((records[records.length - 1].action !== "stop")) {
            records.push({
                action: "stop",
                timestamp: Date.now(),
                project: project
            });
        }

        let ms = timeComputer.computeWorkingTimeFor(records);
        return moment.duration(ms);
    };

    that.getTodayDurationFor = (project) => {
        let day = that.formatDay(Date.now());

        return that.getDurationForDay(project, day);
    };

    that.formatDay = (timestamp) => {
        return moment(timestamp).format("YYYY-MM-DD");
    };

    that.formatDuration = (duration, options) => {
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
