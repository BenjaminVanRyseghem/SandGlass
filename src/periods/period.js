const helper = require("./helper");

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
        let weeks = that.getMonths().reduce((acc, month) => {
            return acc.concat(month.getWeeks());
        });

        let unbroken = weeks.filter((week) => {
            return !week.isBroken();
        });

        let broken = weeks.filter((week) => {
            return week.isBroken();
        });

        let gatheredWeeks = helper.gatherBrokenWeeks(broken);
        let reunitedWeeks = helper.reuniteGatheredBrokenWeeks(gatheredWeeks);

        return unbroken.concat(reunitedWeeks);
    };

    that.getDays = () => {
        return that.getWeeks().map((week) => {
            return week.getDays();
        }).reduce((previous, current) => {
            return previous.concat(current);
        }, []);
    };

    that.accept = (visitor) => {
        return visitor.visitPeriod(that);
    };

    return that;
}

module.exports = period;
