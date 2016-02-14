(function() {
    "use strict";

    const period = require("./period");

    function week(spec, my) {

        spec = spec || {};
        my = my || {};

        let that = period(spec, my);

        my.month = spec.month;
        my.days = spec.days;

        for (let day of my.days) {
            day.setWeek(that);
        }

        that.isBroken = () => {
            return false;
        };

        that.getYear = () => {
            return my.month.getYear();
        };

        // To use only once to set the back pointer
        that.setMonth = (month) => {
            if (my.month) {
                throw new Error("`my.month` has already been set!");
            }

            my.month = month;
        };

        that.getMonths = () => {
            return [my.month];
        };

        that.getWeeks = () => {
            return [that];
        };

        that.getDays = () => {
            return my.days;
        };

        that.accept = (visitor) => {
            return visitor.visitWeek(that);
        };

        that.containsWeek = (week) => {
            return week === that.periodIndex();
        };

        return that;
    }

    module.exports = week;
})();
