(function() {
    "use strict";

    const moment = require("moment");
    require("moment-duration-format");

    const d3 = require("d3");
    require("d3-tip")(d3);

    const dailyGoal = 8; // Can be plugged on settings later

    function barChart(spec, my) {
        spec = spec || {};
        my = my || {};

        let that = {};

        my.data = spec.data;
        my.id = spec.id;

        my.context = {};

        const maxWidth = jQuery(`#${my.id}`).width();

        let yTicks = [];

        let projects = [];
        let legends = {};

        //
        // Public
        //

        that.append = () => {
            let margin = {top: 100, right: 20, bottom: 130, left: 80};
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
                .tickFormat((value) => {
                    return moment.duration(value, "h").format("hh:mm", {
                        trim: false
                    });
                });

            let tip = buildTip({
                y: y,
                height: height
            });

            let container = document.getElementById(my.id);

            let svg = d3.select(container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            svg.call(tip);

            x.domain(my.data.map((d) => { return d.day; }));
            x1.domain(projects).rangeRoundBands([0, x.rangeBand()]);

            setupYDomain({
                y: y,
                legends: legends
            });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .text((day) => {
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

            addGoals(projects, {
                svg: svg,
                width: width,
                y: y
            });

            d3.selectAll(".axis line, .axis path")
                .style({
                    "stroke": "Black",
                    "fill": "none",
                    "stroke-width": "3px"
                });

            let state = svg.selectAll(".bar")
                .data(my.data)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", (d) => `translate(${x(d.day)},0)`);

            state.selectAll("rect")
                .data((d) => { return d.times; })
                .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("class", (d) => {
                    let index = projects.indexOf(d.name);
                    return `subbar series-${index} ${d.name}`;
                })
                .attr("x", (d) => { return x1(d.name); })
                .attr("y", 1 - height)
                .attr("height", (d) => { return height - y(d.value); })
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

            saveContext({
                svg: svg,
                state: state,
                yAxis: yAxis,
                y: y,
                legends: legends,
                height: height
            });
        };

        that.toggleSeries = function(project, context) {
            context = context || my.context;
            let svg = context.svg;
            let legends = context.legends;

            if (legends[project]) {
                let transition = svg.transition().duration(500);
                transition.selectAll(`.${project}`).style("opacity", 0);
                transition.selectAll(`.${project}`).style("visibility", "hidden");
                transition.selectAll(`.goal-line ${project}`).style("opacity", 0);
            } else {
                let transition = svg.transition().duration(500);
                transition.selectAll(`.${project}`).style("opacity", 1);
                transition.selectAll(`.${project}`).style("visibility", "visible");
                transition.selectAll(`.goal-line ${project}`).style("opacity", 1);
            }

            legends[project] = !legends[project];
            update(context);
        };

        //
        // Protected
        //

        my.initialize = () => {
            buildYTicks();
            buildProjects();
            buildLegends();
        };

        //
        // Private
        //

        function saveContext(context) {
            my.context = context;
        }

        function addGoals(projects, context) {
            let svg = context.svg;
            let width = context.width;
            let y = context.y;

            for (let project of projects) {
                let index = projects.indexOf(project);

                svg.append("svg:line")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", y(dailyGoal))
                    .attr("y2", y(dailyGoal))
                    .attr("class", `goal-line series-${index} ${project}`);
            }
        }

        function buildLegends() {
            for (let p of projects) {
                legends[p] = true;
            }
        }

        function buildProjects() {
            for (let d of my.data) {
                for (let p of Object.keys(d.projects)) {
                    if (projects.indexOf(p) === -1) {
                        projects.push(p);
                    }
                }
            }

            my.data.forEach((d) => {
                d.times = projects.map((name) => {
                    return {
                        name: name,
                        value: d.projects[name] || 0
                    };
                });
            });
        }

        function buildYTicks() {
            let maxTime = 0;
            for (let d of my.data) {
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

        function setupYDomain(context) {
            let y = context.y;
            let legends = context.legends;

            y.domain([
                0, d3.max(my.data, (d) => {
                    return d3.max(d.times, (d) => {
                        if (legends[d.name] === false) {
                            return 0;
                        }
                        return d.value;
                    });
                })
            ]);
        }

        function update(context) {
            let svg = context.svg;
            let state = context.state;
            let yAxis = context.yAxis;
            let y = context.y;
            let height = context.height;

            setupYDomain(context);
            svg.selectAll("g.y.axis")
                .transition().duration(500)
                .call(yAxis);

            state.selectAll("rect")
                .data((d) => {
                    return d.times.map((t) => {
                        if (legends[t.name] !== false) {
                            return t;
                        } else {
                            return {
                                name: t.name,
                                value: null
                            };
                        }
                    });
                })
                .attr("y", 1 - height)
                .attr("height", (d) => {
                    return height - y(d.value);
                });

            svg.transition().duration(500)
                .selectAll(".goal-line")
                .attr("y1", y(dailyGoal))
                .attr("y2", y(dailyGoal));
        }

        function buildTip(context) {
            let y = context.y;
            let height = context.height;

            return d3.tip()
                .attr("class", "d3-tip")
                .offset((d) => {
                    return [
                        y(d.value) - height - 10,
                        0
                    ];
                })
                .html((d) => {
                    let value = moment.duration(d.value, "h").format("hh:mm", {
                        trim: false
                    });
                    let index = projects.indexOf(d.name);
                    return `<div class="d3-tooltip series-${index}">
	                        <div class="text">${d.name}</div>
	                        <div class="value">${value}</div>
	                        </div>`;
                });
        }

        my.initialize();

        return that;
    }

    module.exports = barChart;
})();
