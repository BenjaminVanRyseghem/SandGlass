(function() {
    "use strict";

    const helper = require("./helper");

    function period(spec, my) {

        spec = spec || {};
        my = my || {};

        my.periodIndex = spec.periodIndex;

        let that = {};

        that.periodIndex = () => my.periodIndex;

        that.getName = () => {};

        that.isNull = () => false;

        that.getYear = () => {
            return null;
        };

        that.getMonths = () => {
            return that.getYear().getMonths();
        };

        that.getWeeks = () => {
            //... Needs to reunite broken weeks
            let weeks = that.getMonths().reduce((acc, month) => {
                return acc.concat(month.getWeeks());
            }, []);

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
            return that.getMonths().reduce((acc, month) => {
                return acc.concat(month.getDays());
            }, []);
        };

        that.containsYear = (year) => {
            return that.getYear().containsYear(year);
        };

        that.containsMonth = (month) => {
            return that.getMonths().some((m) => {
                return m.containsMonth(month);
            });
        };

        that.containsWeek = (week) => {
            return that.getWeeks().some((w) => {
                return w.containsWeek(week);
            });
        };

        that.containsDay = (day) => {
            return that.getDays().some((d) => {
                return d.containsDay(day);
            });
        };

        that.accept = (visitor) => {
            return visitor.visitPeriod(that);
        };

        return that;
    }

    module.exports = period;
})();
