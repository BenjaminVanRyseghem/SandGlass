function segment(spec, my) {
    "use strict";

    spec = spec || {};
    my = my || {};

    my.start = spec.start;
    my.end = spec.end;

    let that = {};

    that.start = () => {
        return my.start;
    };

    that.end = () => {
        return my.end;
    };

    that.delta = () => {
        return my.end - my.start;
    };

    return that;
}

module.exports = segment;
