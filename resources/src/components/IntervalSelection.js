(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");

    const YearSelection = require("./YearSelection");
    const MonthSelection = require("./MonthSelection");
    const WeekSelection = require("./WeekSelection");

    const remote = require("remote");
    const db = remote.require("../src/db");
    const yearsBuilder = remote.require("../src/periods/yearBuilder");

    class IntervalSelection extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                years: props.years || [],
                selectedYear: null,
                selectedMonth: null,
                selectedWeek: null
            };
        }

        componentDidMount() {
            let days = db.getAllDays();
            let years = yearsBuilder.buildYears(days);

            //let years = [{periodIndex: () => "2017"}, {periodIndex: () => "2015"}, {periodIndex: () => "2016"}];

            this.setState({years: years});
        }

        selectedYear() {
            return this.state.selectedYear || this.state.years[0];
        }

        selectYear(year) {
            this.setState({selectedYear: year});
        }

        selectedMonth() {
            return this.state.selectedMonth || this.selectedYear() && this.selectedYear().getMonths()[0] || null;
        }

        selectMonth(month) {
            this.setState({selectedMonth: month});
        }

        selectedWeek() {
            return this.state.selectedWeek || this.selectedMonth() && this.selectedMonth().getWeeks()[0] || null;
        }

        selectWeek(week) {
            this.setState({selectedWeek: week});
        }

        render() {
            return (
                React.createElement("div", {className: "interval-selection"},
                    React.createElement(YearSelection, {
                        years: this.state.years,
                        selectedYear: this.selectedYear(),
                        handler: this.selectYear.bind(this)
                    }),
                    React.createElement(MonthSelection, {
                        months: this.selectedYear() && this.selectedYear().getMonths() || [],
                        selectedMonth: this.selectedMonth(),
                        handler: this.selectMonth.bind(this)
                    }),
                    React.createElement(WeekSelection, {
                        weeks: this.selectedMonth() && this.selectedMonth().getWeeks() || [],
                        selectedWeek: this.selectedWeek(),
                        handler: this.selectWeek.bind(this)
                    }),
                    "Hello, world! I am a IntervalSelection."
                )
            );
        }
    }

    module.exports = IntervalSelection;
})();
