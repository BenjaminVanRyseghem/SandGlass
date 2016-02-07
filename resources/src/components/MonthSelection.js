(function() {
    "use strict";

    const React = require("react");
    const moment = require("moment");

    const OptionComponent = require("./OptionComponent");
    const BootstrapSelect = require("./BootstrapSelect");

    const remote = require("remote");
    const nullPeriod = remote.require("../src/periods/nullPeriod");

    class MonthSelection extends React.Component {
        formatMonth(month) {
            if(!month) {
                return "";
            }
            return moment(month.periodIndex(), "M").format("MMMM");
        }

        handleChange(event) {
            let index = event.target.value;

            if(index === nullPeriod.periodIndex()) {
                this.props.handler(nullPeriod);
                return;
            }

            let selectedMonth = this.props.months.find((month) => {
                return month.periodIndex() === index;
            });

            this.props.handler(selectedMonth);
        }

        render() {
            return React.createElement(BootstrapSelect, {
                    className: "col-md-3 col-sm-3 col-xs-3 MonthSelection",
                    value: this.props.selectedMonth.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                React.createElement(OptionComponent, {
                    formatter: () => "--",
                    key: nullPeriod.periodIndex(),
                    value: nullPeriod
                }),
                this.props.months.map((month) => {
                    return React.createElement(OptionComponent, {
                        formatter: this.formatMonth,
                        key: month.periodIndex(),
                        value: month
                    });
                })
            );
        }
    }

    module.exports = MonthSelection;
})();
