(function() {
    "use strict";

    function computingState(spec, my) {

        spec = spec || {};
        my = my || {};

        let that = {};

        my.segments = spec.segments || [];

        /* eslint-disable no-unused-vars */
        that.compute = (record) => {
            throw new Error("Should be overridden");
        };
        /* eslint-enable no-unused-vars */

        my.exit = () => {
            return my.segments;
        };

        return that;
    }

    module.exports = computingState;
})();
