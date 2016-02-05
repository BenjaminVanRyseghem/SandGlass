function yearVisitor() {
    "use strict";

    let that = {};
    let numberOfMonths = 0;
    let numberOfUnbrokenWeeks = 0;
    let numberOfBrokenWeeks = 0;
    let numberOfDays = 0;

    that.visitYear = (year) => {
        year.getMonths().forEach((m) => m.accept(that));
    };

    that.visitWeeks = (year) => {
        year.getWeeks().forEach((w) => w.accept(that));
    };

    that.visitMonth = (month) => {
        numberOfMonths++;
        month.getWeeks().forEach((w) => w.accept(that));
    };

    that.visitWeek = (week) => {
        numberOfUnbrokenWeeks++;
        week.getDays().forEach((d) => d.accept(that));
    };

    that.visitBrokenWeek = (week) => {
        numberOfBrokenWeeks++;
        week.getDays().forEach((d) => d.accept(that));
    };

    that.visitDay = (day) => {
        numberOfDays++;
    };

    that.getNumberOfDays = () => {
        return numberOfDays;
    };

    that.getNumberOfUnbrokenWeeks = () => {
        return numberOfUnbrokenWeeks;
    };

    that.getNumberOfBrokenWeeks = () => {
        return numberOfBrokenWeeks;
    };

    that.getNumberOfMonths = () => {
        return numberOfMonths;
    };

    return that;
}

module.exports = yearVisitor;
