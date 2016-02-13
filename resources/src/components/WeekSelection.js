(function() {
    "use strict";

    const React = require("react");

    const OptionComponent = require("./OptionComponent");
    const BootstrapSelect = require("./BootstrapSelect");

    const remote = require("remote");
    const nullPeriod = remote.require("../src/periods/nullPeriod");

    class WeekSelection extends React.Component {
        formatWeek(week) {
            if (!week) {
                return "";
            }
            return `Week ${week.periodIndex()}`;
        }

        handleChange(event) {
            let index = event.target.value;

            if (index === nullPeriod.periodIndex()) {
                this.props.handler(nullPeriod);
                return;
            }

            let selectedWeek = this.props.weeks.find((week) => {
                return week.periodIndex() === index;
            });

            this.props.handler(selectedWeek);
        }

        render() {
            return React.createElement(BootstrapSelect, {
                    className: "col-md-3 col-sm-3 col-xs-3 WeekSelection",
                    value: this.props.selectedWeek.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                React.createElement(OptionComponent, {
                    formatter: () => "--",
                    key: nullPeriod.periodIndex(),
                    value: nullPeriod
                }),
                this.props.weeks.map((week) => {
                    return React.createElement(OptionComponent, {
                        formatter: this.formatWeek,
                        key: week.periodIndex(),
                        value: week
                    });
                })
            );
        }
    }

    module.exports = WeekSelection;
})();
