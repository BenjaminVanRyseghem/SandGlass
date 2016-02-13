(function() {
    "use strict";

    const React = require("react");
    const moment = require("moment");

    const OptionComponent = require("./OptionComponent");
    const BootstrapSelect = require("./BootstrapSelect");

    const remote = require("remote");
    const nullPeriod = remote.require("../src/periods/nullPeriod");

    class DaySelection extends React.Component {
        formatDay(day) {
            if(!day){
                return "";
            }

            return moment(day.periodIndex(), "DDD").format("dddd Do");
        }

        handleChange(event) {
            let index = event.target.value;

            if (index === nullPeriod.periodIndex()) {
                this.props.handler(nullPeriod);
                return;
            }

            let selectedDay = this.props.days.find((day) => {
                return day.periodIndex() === index;
            });
            this.props.handler(selectedDay);
        }

        render() {
            return React.createElement(BootstrapSelect, {
                    className: "col-md-3 col-sm-3 col-xs-3 DaySelection",
                    value: this.props.selectedDay.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                React.createElement(OptionComponent, {
                    formatter: () => "--",
                    key: nullPeriod.periodIndex(),
                    value: nullPeriod
                }),
                this.props.days.map((day) => {
                    return React.createElement(OptionComponent, {
                        formatter: this.formatDay,
                        key: day.periodIndex(),
                        value: day
                    });
                })
            );
        }
    }

    module.exports = DaySelection;
})();
