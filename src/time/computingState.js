(function() {
    "use strict";

    function computingState(spec, my) {

        spec = spec || {};
        my = my || {};

        let that = {};

        my.segments = spec.segments || [];

        that.compute = (record) => {
            throw new Error("Should be overridden");
        };

        my.exit = () => {
            return my.segments;
        };

        return that;
    }

    module.exports = computingState;
})();
