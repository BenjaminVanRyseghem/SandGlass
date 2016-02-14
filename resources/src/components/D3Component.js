(function() {
    "use strict";

    const React = require("react");
    const remote = require("remote");

    const periodNameBuilder = remote.require("../resources/src/periodNameBuilder");
    const db = remote.require("../src/db");
    const time = remote.require("../src/time");

    let nextId;

    (() => {
        let i = 0;
        nextId = () => {
            return i++;
        };
    })();

    class D3Component extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                id: `d3-container-${nextId()}`
            };
        }

        componentDidMount() {
            if (this.props.period.isNull()) {
                return;
            }

            let chart = this.props.chart({
                id: this.state.id,
                data: this.buildData()
            });

            chart.append();
        }

        componentDidUpdate() {
            jQuery(`#${this.state.id}`).empty();
            this.componentDidMount();
        }

        buildData() {

            let days = this.props.period.getDays();

            return days.map((day) => {
                let times = {};

                let projects = db.projectsFor(day.identifier());

                for (let project of projects) {
                    times[project] = time.getDurationForDay(project, day.identifier()).asHours();
                }

                return {
                    day: day.identifier(),
                    projects: times
                };
            });
        }

        render() {
            let visitor = periodNameBuilder();
            let name = this.props.period.accept(visitor);

            return (
                React.createElement("div", {className: "dashboard-graph"},
                    React.createElement("h2", {className: "graph-title"},
                        `Data for ${name}`
                    ),
                    React.createElement("div", {id: this.state.id})
                )
            );
        }
    }

    module.exports = D3Component;
})();
