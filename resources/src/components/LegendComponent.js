(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");
    
    const moment = require("moment");
    require("moment-duration-format");
    const remote = require("remote");

    const time = remote.require("../src/time");

    class LegendComponent extends React.Component {
        render() {
            let days = this.props.period.getDays();
            let value = days.reduce((acc, day) => {
                return acc.add(time.getDurationForDay(this.props.project, day.identifier()));
            }, moment.duration(0));

            return React.createElement("li", {
                    className: `legend-item ${this.props.project} series-${this.props.index}`,
                    onClick: () => {
                        $(ReactDOM.findDOMNode(this)).toggleClass("inactive");
                        this.props.onClick();
                    }
                },
                React.createElement("div", {
                        className: "project-name"
                    },
                    this.props.project
                ), React.createElement("div", {
                        className: "project-time"
                    },
                    value.format("HH:mm:ss")
                )
            );
        }
    }

    module.exports = LegendComponent;
})();
