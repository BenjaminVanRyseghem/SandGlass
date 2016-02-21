(function() {
    "use strict";

    const React = require("react");

    const OptionComponent = require("./OptionComponent");
    const BootstrapSelect = require("./BootstrapSelect");


    const remote = require("remote");
    const groupBuilder = remote.require("../resources/src/groupBuilderPeriodVisitor");

    class PeriodSelection extends React.Component {
        constructor(props) {
            super(props);
            this.components = {};
        }

        handleChange(event) {
            let index = event.target.value;
            let component = this.components[index];

            this.props.handler({
                period: component.props.period,
                value: component.props.value
            });
        }

        buildPeriodGroups() {
            let visitor = groupBuilder();
            return this.props.year.accept(visitor);
        }

        buildComponentsFromGroups(groups) {
            this.components = {};

            return Object.keys(groups).map((groupName) => {
                let group = groups[groupName];
                return React.createElement("optgroup", {
                    key: groupName,
                    label: groupName
                }, group.map((data) => {
                    let index = data.period.periodIndex();
                    let value = `${groupName}-${index}`;
                    let component = React.createElement(OptionComponent, {
                        formatter: () => data.name,
                        key: value,
                        value: value,
                        period: data.period
                    });

                    this.components[value] = component;
                    return component;
                }));
            });
        }

        render() {
            let groups = this.buildPeriodGroups();
            let components = this.buildComponentsFromGroups(groups);

            return React.createElement(BootstrapSelect, {
                    className: "period-selection",
                    value: this.props.selectedPeriod.value,
                    onChange: this.handleChange.bind(this)
                },
                components
            );
        }
    }

    module.exports = PeriodSelection;
})();
