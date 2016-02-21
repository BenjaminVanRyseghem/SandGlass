(function() {
    "use strict";

    const React = require("react");
    const moment = require("moment");
    const IntervalSelection = require("./IntervalSelection");
    const D3Component = require("./D3Component");

    const remote = require("remote");
    const db = remote.require("../src/db");
    const yearBuilder = remote.require("../src/periods/yearBuilder");

    const barChart = require("../barChart");

    class DashboardComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                years: props.years || []
            };
        }

        componentWillMount() {
            let days = db.getAllDays();
            let years = yearBuilder.buildYears(days);

            this.setState({
                years: years,
                period: this.buildDefaultPeriod(years)
            });
        }

        buildDefaultPeriod(years) {
            let year = (this.state.period && this.state.period.period.getYear()) || (years && years[0]) || this.state.years[0];
            let week = year.getWeeks().find((week) => {
                return week.periodIndex() === moment().format("W");
            });

            return {
                period: week,
                value: this.buildWeekIndex(week)
            };
        }

        buildWeekIndex(week) {
            let now = moment(week.periodIndex(), "W");
            let month = moment(now).format("MMMM");

            return `${month}-${week.periodIndex()}`;
        }

        setPeriod(period) {
            this.setState({
                period: period
            });
        }

        render() {
            return React.createElement("div", {className: "content"},
                React.createElement(IntervalSelection, {
                    years: this.state.years,
                    update: this.setPeriod.bind(this),
                    defaultPeriod: this.buildDefaultPeriod()
                }),
                React.createElement(D3Component, {
                    chart: barChart,
                    period: this.state.period.period
                })
            );
        }
    }

    module.exports = DashboardComponent;
})();
