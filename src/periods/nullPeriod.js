(function() {
    "use strict";

    const period = require("./period");

    function nullPeriod() {

        let that = period();

        that.periodIndex = () => {
            return "null";
        };

        that.isNull = () => true;

        that.getYears = () => [that];
        that.getMonths = () => [that];
        that.getWeeks = () => [that];
        that.getDays = () => [that];

        that.containsYear = () => false;
        that.containsMonth = () => false;
        that.containsWeek = () => false;
        that.containsDay = () => false;

        that.accept = (visitor) => {
            return visitor.visitNullPeriod(that);
        };

        return that;
    }

    module.exports = nullPeriod();
})();
