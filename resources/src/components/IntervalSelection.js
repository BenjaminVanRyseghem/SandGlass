(function() {
    "use strict";

    const React = require("react");

    const YearSelection = require("./YearSelection");
    const PeriodSelection = require("./PeriodSelection");

    const remote = require("remote");
    const nullPeriod = remote.require("../src/periods/nullPeriod");
    const periodNameBuilder = remote.require("../resources/src/periodNameBuilder");

    class IntervalSelection extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                selectedYear: nullPeriod,
                selectedPeriod: this.props.defaultPeriod
            };
        }

        selectedYear() {
            if (!this.state.selectedYear.isNull()) {
                return this.state.selectedYear;
            } else {
                return this.props.years[0] || nullPeriod;
            }
        }

        selectYear(year) {
            this.selectPeriod({
                period: year,
                value: `year-${year.periodIndex()}`
            });

            this.setState({selectedYear: year});
        }

        selectedPeriod() {
            if (this.state.selectedPeriod && !this.state.selectedPeriod.period.isNull()) {
                return this.state.selectedPeriod;
            } else {
                return this.props.defaultPeriod;
            }
        }

        selectPeriod(period) {
            this.props.update(period);
            this.setState({selectedPeriod: period});
        }

        render() {
            let visitor = periodNameBuilder();
            let name = this.state.selectedPeriod.period.accept(visitor);

            return (
                React.createElement("div", {className: "interval-selection"},
                    React.createElement("div", {
                        className: "title"
                    }, `Data for ${name}`),
                    React.createElement("div", {
                            className: "pickers"
                        },
                        React.createElement(PeriodSelection, {
                            year: this.selectedYear(),
                            key: "period",
                            selectedPeriod: this.selectedPeriod(),
                            handler: this.selectPeriod.bind(this)
                        }),
                        React.createElement(YearSelection, {
                            years: this.props.years,
                            key: "year",
                            selectedYear: this.selectedYear(),
                            handler: this.selectYear.bind(this)
                        })
                    )
                )
            );
        }
    }

    module.exports = IntervalSelection;
})();
