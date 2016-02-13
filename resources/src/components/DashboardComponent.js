(function() {
    "use strict";

    const React = require("react");
    const IntervalSelection = require("./IntervalSelection");
    const D3Component = require("./D3Component");

    const remote = require("remote");
    const nullPeriod = remote.require("../src/periods/nullPeriod");

    const barChart = require("../barChart");

    class DashboardComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                period: nullPeriod
            };
        }

        setPeriod(period) {
            this.setState({
                period: period
            });
        }

        render() {
            return React.createElement("div", {className: "content"},
                React.createElement(IntervalSelection, {
                    update: this.setPeriod.bind(this)
                }),
                React.createElement(D3Component, {
                    chart: barChart,
                    period: this.state.period
                })
            );
        }
    }

    module.exports = DashboardComponent;
})();
