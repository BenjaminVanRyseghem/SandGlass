
const db = require("./db");
const timeComputer = require("./timeComputer");
const moment = require("moment");
require("moment-duration-format");

function helper() {
    'use strict';

    let that = {};

    that.getDurationFor = (project, day) => {
        let records = db.getRecordsFor(project, day);

        if (!records.length) {
            return moment.duration(0);
        }

        let ms = timeComputer.computeWorkingTimeFor(records);
        return moment.duration(ms);
    };

    that.formatDuration = (duration) => {
        return duration.format("hh:mm:ss", {
            trim: false
        });
    };

    return that;
}

module.exports = helper();
