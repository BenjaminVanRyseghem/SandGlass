(function() {
    "use strict";

    const React = require("react");
    const remote = require("remote");

    const LegendComponent = require("./LegendComponent");

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

            this.chart = this.props.chart({
                id: this.state.id,
                data: this.buildData()
            });

            this.chart.append();
        }

        componentDidUpdate() {
            jQuery(`#${this.state.id}`).empty();
            this.componentDidMount();
        }

        buildData() {

            let days = this.props.period.getDays();

            return days.map((day) => {
                let times = {};
                let projects = this.projects || [];

                for (let project of projects) {
                    times[project] = time.getDurationForDay(project, day.identifier()).asHours();
                }

                return {
                    day: day.identifier(),
                    projects: times
                };
            });
        }

        updateProjects() {
            let days = this.props.period.getDays();
            let result = [];

            for (let day of days) {
                let projects = db.projectsFor(day.identifier());
                for (let project of projects) {
                    if (result.indexOf(project) === -1) {
                        result.push(project);
                    }
                }
            }

            this.projects = result;
        }

        render() {

            this.updateProjects();

            return (
                React.createElement("div", {className: "dashboard-graph"},
                    React.createElement("div", {
                        className: "d3-container",
                        id: this.state.id
                    }),
                    React.createElement("ul", {
                            className: "legends"
                        },
                        this.projects.map((project, index) => {
                            return React.createElement(LegendComponent, {
                                key: `legend-${project}`,
                                project: project,
                                index: index,
                                onClick: () => {
                                    this.chart.toggleSeries(project);
                                },
                                period: this.props.period
                            });
                        })
                    )
                )
            );
        }
    }

    module.exports = D3Component;
})();
