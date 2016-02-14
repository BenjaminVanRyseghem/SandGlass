(function() {
    "use strict";

    const moment = require("moment");

    function periodNameBuilder() {
        let that = {};

        that.visitYear = (year) => {
            return year.periodIndex();
        };

        that.visitMonth = (month) => {
            return moment(month.periodIndex(), "M").format("MMMM");
        };

        that.visitWeek = (week) => {
            return `Week ${week.periodIndex()}`;
        };

        that.visitBrokenWeek = (week) => {
            return `Week ${week.periodIndex()}`;
        };

        that.visitDay = (day) => {
            return moment(day.identifier()).format("dddd Do MMMM");
        };

        /* eslint-disable no-unused-vars */
        that.visitNullPeriod = (nullPeriod) => {
            return "";
        };
        /* eslint-enable no-unused-vars */

        return that;
    }

    module.exports = periodNameBuilder;

})();
