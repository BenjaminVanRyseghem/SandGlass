(function() {
    "use strict";

    const moment = require("moment");

    function periodNameBuilder(spec) {
        spec = spec || {};
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

        that.visitNullPeriod = (nullPeriod) => {
            return "";
        };

        return that;
    }

    module.exports = periodNameBuilder;

})();
