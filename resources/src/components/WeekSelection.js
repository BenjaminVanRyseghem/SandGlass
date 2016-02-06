(function() {
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");

    class WeekSelection extends React.Component {
        handleChange(event) {
            let index = jQuery(event.target).find(":selected").attr("data-index");
            let selectedWeek = this.props.weeks.find((week) => {
                return week.periodIndex() === index;
            });

            this.props.handler(selectedWeek);
        }

        render() {

            return React.createElement("select", {
                    className: "WeekSelection",
                    value: this.props.selectedWeek && this.props.selectedWeek.periodIndex(),
                    onChange: this.handleChange.bind(this)
                },
                this.props.weeks.map((week) => {
                    let index = week.periodIndex();
                    let name = `Week ${index}`;
                    return React.createElement("option", {
                        key: index,
                        "data-index": index
                    }, name);
                })
            );
        }
    }

    module.exports = WeekSelection;
})();
