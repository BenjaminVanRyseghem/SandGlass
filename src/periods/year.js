const period = require("./period");

function year(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    let that = period(spec, my);

    my.months = spec.months;

    for (let month of my.months) {
        month.setYear(that);
    }

    that.getName = () => {};

    that.getYear = () => {
        return that;
    };

    that.getMonths = () => {
        return my.months;
    };

    that.accept = function(visitor) {
        return visitor.visitYear(that);
    };

    return that;
}

module.exports = year;
