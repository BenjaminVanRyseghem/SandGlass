(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");
    const moment = require("moment");

    class MonthSelection extends React.Component {
        handleChange(event) {
            let index = jQuery(event.target).find(":selected").attr("data-index");
            let selectedMonth = this.props.months.find((month) => {
                return month.periodIndex() === index;
            });

            this.props.handler(selectedMonth);
        }

        render() {

            return React.createElement("select", {
                    className: "MonthSelection",
                    value: this.props.selectedMonth && this.props.selectedMonth.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                this.props.months.map((month) => {
                    let index = month.periodIndex();
                    let name = moment(index, "M").format("MMMM");
                    return React.createElement("option", {
                        key: index,
                        "data-index": index
                    }, name);
                })
            );
        }
    }

    module.exports = MonthSelection;
})();
