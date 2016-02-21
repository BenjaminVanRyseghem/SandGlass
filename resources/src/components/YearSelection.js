(function() {
    "use strict";

    const React = require("react");

    const OptionComponent = require("./OptionComponent");
    const BootstrapSelect = require("./BootstrapSelect");

    class YearSelection extends React.Component {
        formatYear(year) {
            if (!year) {
                return "";
            }

            return year.periodIndex();
        }
        handleChange(event) {
            let index = event.target.value;
            let selectedYear = this.props.years.find((year) => {
                return year.periodIndex() === index;
            });

            this.props.handler(selectedYear);
        }

        render() {
            return React.createElement(BootstrapSelect, {
                    pickerOptions: {
                        iconBase: "fa",
                        tickIcon: "fa-check",
                        showTick: true
                    },
                    className: "YearSelection",
                    value: this.props.selectedYear.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                this.props.years.map((year) => {
                    return React.createElement(OptionComponent, {
                        formatter: this.formatYear,
                        key: year.periodIndex(),
                        value: year
                    });
                })
            );
        }
    }

    module.exports = YearSelection;
})();
