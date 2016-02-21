(function() {
    "use strict";
    const moment = require("moment");

    function groupBuilderPeriodVisitor() {

        let that = {};
        let groups = {};

        that.visitYear = (year) => {
            groups = {};

            for (let month of year.getMonths()) {
                month.accept(that);
            }

            for (let week of year.getWeeks()) {
                week.accept(that);
            }

            groups["Year"] = [
                {
                    name: buildYearName(year),
                    period: year
                }
            ];

            return groups;
        };

        that.visitMonth = (month) => {
            let monthName = buildMonthName(month);
            let data = [];

            for (let week of month.getWeeks()) {
                data.push({
                    name: buildWeekName(week),
                    period: week
                });
            }

            data.push({
                name: monthName,
                period: month
            });

            groups[monthName] = data;
        };

        that.visitWeek = (week) => {
            if (!groups["Weeks"]) {
                groups["Weeks"] = [];
            }

            groups["Weeks"].push({
                name: buildWeekName(week),
                period: week
            });
        };

        that.visitNullPeriod = () => {
            return {};
        };

        function buildYearName(year) {
            return year.periodIndex();
        }

        function buildMonthName(month) {
            return moment(month.periodIndex(), "M").format("MMMM");
        }

        function buildWeekName(week) {
            return `Week ${week.periodIndex()}`;
        }

        return that;
    }

    module.exports = groupBuilderPeriodVisitor;
})();
