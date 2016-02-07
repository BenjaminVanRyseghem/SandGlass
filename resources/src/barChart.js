(function() {
    "use strict";

    const moment = require("moment");
    require("moment-duration-format");

    const d3 = require("d3");
    require("d3-tip")(d3);

    function barChart(spec) {
        spec = spec || {};

        let that = {};

        let data = spec.data;
        let id = spec.id;

        let maxWidth = window.innerWidth;
        let yTicks = [];

        let projects = [];
        var legends = {};

        that.initialize = () => {
            buildYTicks();
            buildProjects();
            buildLegends();
        };

        function buildLegends() {
            for (let p of projects) {
                legends[p] = true;
            }
        }

        function buildProjects() {
            for (let d of data) {
                for (let p of Object.keys(d.projects)) {
                    if (projects.indexOf(p) === -1) {
                        projects.push(p);
                    }
                }
            }

            data.forEach(function(d) {
                d.times = projects.map(function(name) {
                    return {
                        name: name,
                        value: d.projects[name] || 0
                    };
                });
            });
        }

        function buildYTicks() {
            let maxTime = 0;
            for (let d of data) {
                for (let p of Object.keys(d.projects)) {
                    if (d.projects[p] > maxTime) {
                        maxTime = d.projects[p];
                    }
                }
            }

            // Split in hours
            let steps = Math.floor(maxTime);
            for (let i = 0; i <= steps; i++) {
                yTicks.push(i);
            }
        }

        that.append = () => {
            let margin = {top: 100, right: 120, bottom: 130, left: 80};
            let width = maxWidth - margin.left - margin.right;
            let height = 500 - margin.top - margin.bottom;

            let x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);

            let x1 = d3.scale.ordinal();

            let y = d3.scale.linear()
                .range([height, 0]);

            let xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            let yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickValues(yTicks)
                .tickFormat(function(value) {
                    return moment.duration(value, "h").format("hh:mm", {
                        trim: false
                    });
                });

            let tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                    let value = moment.duration(d.value, "h").format("hh:mm", {
                        trim: false
                    });
                    let index = projects.indexOf(d.name);
                    return `<div class="d3-tooltip series-${index}">
                    <div class="text">${d.name}</div>
                    <div class="value">${value}</div>
                    </div>`;
                });

            let container = document.getElementById(id);

            let svg = d3.select(container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);

            x.domain(data.map(function(d) { return d.day; }));
            x1.domain(projects).rangeRoundBands([0, x.rangeBand()]);

            y.domain([0, d3.max(data, function(d) { return d3.max(d.times, function(d) { return d.value; }); })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .text(function(day) {
                    return moment(day).format("ddd DD/MM");
                })
                .attr("transform", "rotate(-90)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Time");

            for (let project of projects) {
                let index = projects.indexOf(project);
                let dailyGoal = 8; // Can be plugged on settings later

                svg.append("svg:line")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", y(dailyGoal))
                    .attr("y2", y(dailyGoal))
                    .attr("class", `goal-line series-${index}`);
            }

            d3.selectAll(".axis line, .axis path")
                .style({
                    "stroke": "Black",
                    "fill": "none",
                    "stroke-width": "3px"
                });

            let state = svg.selectAll(".bar")
                .data(data)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function(d) { return "translate(" + x(d.day) + ",0)"; });

            state.selectAll("rect")
                .data(function(d) { return d.times; })
                .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("class", (d) => {
                    let index = projects.indexOf(d.name);
                    return `subbar series-${index} ${d.name}`;
                })
                .attr("x", function(d) { return x1(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

            var legend = svg.selectAll(".legend")
                .data(projects.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18 + margin.right - 20)
                .attr("width", 18)
                .attr("height", 18)
                .attr("id", (project) => `legend-icon-${project}`)
                .attr("class", (project) => {
                    let index = projects.indexOf(project);
                    return `legend-icon series-${index}`;
                })
                .on("click", legendClick);

            legend.append("text")
                .attr("x", width - 24 + margin.right - 20)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .attr("id", (project) => `legend-text-${project}`)
                .on("click", legendClick)
                .text(function(d) { return d; });

            function legendClick(project) {
                if (legends[project]) {
                    let transition = svg.transition().duration(500);
                    transition.selectAll(`.${project}`).style("opacity", 0);
                    transition.selectAll(`#legend-icon-${project}`).style("opacity", 0.3);
                    transition.selectAll(`#legend-text-${project}`).style("opacity", 0.3);
                } else {
                    let transition = svg.transition().duration(500);
                    transition.selectAll(`.${project}`).style("opacity", 1);
                    transition.selectAll(`#legend-icon-${project}`).style("opacity", 1);
                    transition.selectAll(`#legend-text-${project}`).style("opacity", 1);
                }

                legends[project] = !legends[project];
            }
        };

        that.initialize();

        return that;
    }

    module.exports = barChart;
})();
