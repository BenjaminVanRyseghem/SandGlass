const period = require("./period");

function month(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    let that = period(spec, my);

    my.year = spec.year;
    my.weeks = spec.weeks;

    for (let week of my.weeks) {
        week.setMonth(that);
    }

    that.getName = () => {};

    // To use only once to set the back pointer
    that.setYear = (year) => {
        if (my.year) {
            throw new Error("`my.year` has already been set!");
        }

        my.year = year;
    };

    that.getYear = () => {
        return my.year;
    };

    that.getMonths = () => {
        return [that];
    };

    that.getWeeks = () => {
        return my.weeks;
    };

    that.accept = (visitor) => {
        return visitor.visitMonth(that);
    };

    return that;
}

module.exports = month;
