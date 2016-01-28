function yearVisitor() {
    "use strict";

    let that = {};
    let numberOfDays = 0;

    that.visitYear = (year) => {
        year.getMonths().forEach((m) => m.accept(that));
    };

    that.visitMonth = (month) => {
        month.getWeeks().forEach((w) => w.accept(that));
    };

    that.visitWeek = (week) => {
        week.getDays().forEach((d) => d.accept(that));
    };

    that.visitBrokenWeek = (week) => {
        week.getDays().forEach((d) => d.accept(that));
    };

    that.visitDay = (day) => {
        numberOfDays++;
    };

    that.getNumberOfDays = () => {
        return numberOfDays;
    };

    return that;
}

module.exports = yearVisitor();
