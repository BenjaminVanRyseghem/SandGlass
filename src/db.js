const settings = require("./settings");

function db() {
    "use strict";

    let that = {};

    const low = require("lowdb");
    const storage = require("lowdb/file-sync");
    const db = low(`${settings.ensureSettingsFolderPath()}db.json`, {storage});

    /**
     * Start the timer for the provided project
     * @param project
     */
    that.start = (project) => {
        project = project || "default";

        let date = require("./time").formatDay(Date.now());
        db(date).push({
            project: project,
            action: "start",
            timestamp: Date.now()
        });
    };

    /**
     * Stop the timer for the provided project
     * @param project
     */
    that.stop = (project) => {
        project = project || "default";

        let date = require("./time").formatDay(Date.now());
        db(date).push({
            project: project,
            action: "stop",
            timestamp: Date.now()
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

        return db(day)
            .chain()
            .filter({project: project})
            .sortBy("timestamp")
            .value()
            .slice();
    };

    return that;
}

module.exports = db();
