(function() {
    "use strict";

    const React = require("react");

    const YearSelection = require("./YearSelection");
    const MonthSelection = require("./MonthSelection");
    const WeekSelection = require("./WeekSelection");
    const DaySelection = require("./DaySelection");

    const remote = require("remote");
    const db = remote.require("../src/db");
    const yearBuilder = remote.require("../src/periods/yearBuilder");
    const nullPeriod = remote.require("../src/periods/nullPeriod");

    class IntervalSelection extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                years: props.years || [],
                selectedYear: nullPeriod,
                selectedMonth: nullPeriod,
                selectedWeek: nullPeriod,
                selectedDay: nullPeriod
            };
        }

        componentDidMount() {
            let days = db.getAllDays();
            let years = yearBuilder.buildYears(days);

            this.setState({years: years});
            this.selectYear(years[0]);
        }

        selectedYear() {
            if (!this.state.selectedYear.isNull()) {
                return this.state.selectedYear;
            } else {
                return this.state.years[0] || nullPeriod;
            }
        }

        selectYear(year) {
            this.selectMonth(nullPeriod);

            let period = this.findPeriodFromYear(year);
            this.props.update(period);

            this.setState({selectedYear: year});
        }

        selectedMonth() {
            return this.state.selectedMonth;
        }

        selectMonth(month) {
            this.selectWeek(nullPeriod);

            let period = this.findPeriodFromMonth(month);
            this.props.update(period);

            this.setState({selectedMonth: month});
        }

        selectedWeek() {
            return this.state.selectedWeek;
        }

        selectWeek(week) {
            this.selectDay(nullPeriod);

            let period = this.findPeriodFromWeek(week);
            this.props.update(period);

            this.setState({selectedWeek: week});
        }

        getWeeks() {
            if (!this.selectedMonth().isNull()) {
                return this.selectedMonth().getWeeks();
            } else {
                return this.selectedYear().getWeeks();
            }
        }

        selectedDay() {
            return this.state.selectedDay;
        }

        selectDay(day) {
            let period = this.findPeriodFromDay(day);
            this.props.update(period);

            this.setState({selectedDay: day});
        }

        findPeriodFromYear(year) {
            if (year && !year.isNull()) {
                return year;
            }
        }

        findPeriodFromMonth(month) {
            if (month && !month.isNull()) {
                return month;
            }

            return this.findPeriodFromYear(this.selectedYear());
        }

        findPeriodFromWeek(week) {
            if (week && !week.isNull()) {
                return week;
            }

            return this.findPeriodFromMonth(this.selectedMonth());
        }

        findPeriodFromDay(day) {
            if (day && !day.isNull()) {
                return day;
            }

            return this.findPeriodFromWeek(this.selectedWeek());
        }

        render() {
            let dropdowns = [
                React.createElement(YearSelection, {
                    years: this.state.years,
                    key: "year",
                    selectedYear: this.selectedYear(),
                    handler: this.selectYear.bind(this)
                })
            ];

            if (!this.selectedYear().isNull()) {
                dropdowns.push(React.createElement(MonthSelection, {
                    months: this.selectedYear().getMonths(),
                    key: "month",
                    selectedMonth: this.selectedMonth(),
                    handler: this.selectMonth.bind(this)
                }));
            }

            if (!this.selectedMonth().isNull() || !this.selectedYear().isNull()) {
                dropdowns.push(React.createElement(WeekSelection, {
                    weeks: this.getWeeks(),
                    key: "week",
                    selectedWeek: this.selectedWeek(),
                    handler: this.selectWeek.bind(this)
                }));
            }

            if (!this.selectedWeek().isNull()) {
                dropdowns.push(React.createElement(DaySelection, {
                    days: this.selectedWeek().getDays(),
                    key: "day",
                    selectedDay: this.selectedDay(),
                    handler: this.selectDay.bind(this)
                }));
            }

            return (
                React.createElement("div", {className: "row interval-selection"},
                    dropdowns
                )
            );
        }
    }

    module.exports = IntervalSelection;
})();
