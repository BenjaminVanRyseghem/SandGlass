(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");

    class YearSelection extends React.Component {
        handleChange(event) {
            let index = jQuery(event.target).find(":selected").attr("data-index");
            let selectedYear = this.props.years.find((year) => {
                return year.periodIndex() === index;
            });

            this.props.handler(selectedYear);
        }

        render() {
            return React.createElement("select", {
                    className: "YearSelection",
                    value: this.props.selectedYear && this.props.selectedYear.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                this.props.years.map((year) => {
                    let index = year.periodIndex();
                    return React.createElement("option", {
                        key: index,
                        "data-index": index
                    }, index);
                })
            );
        }
    }

    module.exports = YearSelection;
})();
