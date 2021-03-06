(function() {
    "use strict";

    const period = require("./period");

    function year(spec, my) {

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

        that.accept = (visitor) => {
            return visitor.visitYear(that);
        };

        that.containsYear = (year) => {
            return year === that.periodIndex();
        };

        return that;
    }

    module.exports = year;
})();
