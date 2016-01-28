function period(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    my.periodIndex = spec.periodIndex;

    let that = {};

    that.periodIndex = () => my.periodIndex;

    that.getName = () => {};

    that.getYear = () => {
        return that;
    };

    that.getMonths = () => {
        return that.getYear().getMonths();
    };

    that.getWeeks = () => {
        //... Needs to reunite broken weeks
    };

    that.getDays = () => {
        return that.getWeeks().map((week) => {
            return week.getDays();
        }).reduce((previous, current) => {
            return previous.concat(current);
        }, []);
    };

    that.accept = function(visitor) {
        return visitor.visitPeriod(that);
    };

    return that;
}

module.exports = period;
