const moment = require("moment");
const low = require("lowdb");
const fs = require("fs");
const storage = require("lowdb/file-sync");

const settings = require("./settings");
const tickler = require("./tickler");

function db() {
    "use strict";

    let that = {};
    let database = low(`${settings.databaseFolder()}db.json`, {storage});

    /**
     * Start the timer for the provided project
     * @param project
     */
    that.start = (project) => {
        project = project || "default";

        if (project === settings.projectToShowInTray() && settings.showTimerInTray()) {
            tickler.start();
        }

        let date = require("./time").formatDay(Date.now());
        database(date).push({
            project: project,
            action: "start",
            timestamp: Date.now(),
            time: moment(Date.now()).format("HH:mm:ss")
        });
    };

    /**
     * Stop the timer for the provided project
     * @param project
     */
    that.stop = (project) => {
        project = project || "default";

        if (project === settings.projectToShowInTray()) {
            tickler.stop();
        }

        let date = require("./time").formatDay(Date.now());
        database(date).push({
            project: project,
            action: "stop",
            timestamp: Date.now(),
            time: moment(Date.now()).format("HH:mm:ss")
        });
    };

    /**
     * Return all the records for the provided day and project.
     * The records are sorted based on their timestamp
     * @param project
     * @param day
     * @returns {*}
     */
    that.getRecordsFor = (project, day) => {
        project = project || "default";

        if (!day) {
            throw new Error("`day` is mandatory");
        }

        return database(day)
            .chain()
            .filter({project: project})
            .sortBy("timestamp")
            .value()
            .slice();
    };

    that.isRunningFor = (project) => {
        let day = require("./time").formatDay(Date.now());
        let records = that.getRecordsFor(project, day);

        if (!records.length) {
            return false;
        }

        let last = records[records.length - 1];
        return last.action === "start";
    };

    that.migrate = (options) => {
        let from = options.from;
        let to = options.to;

        fs.renameSync(`${from}db.json`, `${to}db.json`);

        database = low(`${settings.databaseFolder()}db.json`, {storage});
    };

    return that;
}

module.exports = db();
