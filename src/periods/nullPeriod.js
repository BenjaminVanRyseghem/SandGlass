(function() {
    "use strict";

    function nullPeriod() {

        let that = {};

        that.periodIndex = () => {
            return "null";
        };

        that.isNull = () => true;

        that.getYears = () => [that];
        that.getMonths = () => [that];
        that.getWeeks = () => [that];
        that.getDays = () => [that];

        that.accept = (visitor) => {
            return visitor.visitNullPeriod(that);
        };

        return that;
    }

    module.exports = nullPeriod();
})();
