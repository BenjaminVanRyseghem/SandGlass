(function() {
    "use strict";

    const period = require("./period");

    function day(spec, my) {

        spec = spec || {};
        my = my || {};

        let that = period(spec, my);

        my.week = spec.week;
        my.identifier = spec.identifier;

        that.identifier = () => {
            return my.identifier;
        };

        that.getYear = () => {
            return my.week.getYear();
        };

        that.getMonths = () => {
            return my.week.getMonths();
        };

        // To use only once to set the back pointer
        that.setWeek = (week) => {
            if (my.week) {
                throw new Error("`my.week` has already been set!");
            }

            my.week = week;
        };

        that.getWeeks = () => {
            return [my.week];
        };

        that.getDays = () => {
            return [that];
        };

        that.accept = (visitor) => {
            return visitor.visitDay(that);
        };

        that.clone = () => {
            return day({
                identifier: my.identifier,
                periodIndex: my.periodIndex
            });
        };

        that.containsDay = (day) => {
            return day === that.identifier();
        };

        return that;
    }

    module.exports = day;
})();
