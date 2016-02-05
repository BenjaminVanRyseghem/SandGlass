const electron = require("electron");
const app = electron.app;

const settings = require("./settings");
const db = require("./db");
const info = require("./info");
const time = require("./time");
const helper = require("./periods/helper");

const net = require("net");
const nodeREPL = require("repl");
const fs = require("fs");
const spawnargs = require("spawn-args");
const commandLineArgs = require("command-line-args");
const ansi = require("ansi-styles");
const Table = require("cli-table");

function repl() {
    "use strict";

    let that = {};

    const cliOptions = [
        {
            name: "help",
            alias: "h",
            type: Boolean,
            defaultOption: true,
            description: "Display this text"
        },
        {
            name: "version",
            alias: "v",
            type: Boolean,
            description: "Display the version text"
        },

        {
            name: "start",
            alias: "s",
            type: Boolean,
            description: "Start the clock"
        },
        {
            name: "stop",
            alias: "S",
            type: Boolean,
            description: "Stop the clock"
        },
        {
            name: "day",
            alias: "d",
            type: Boolean,
            description: "Display time spent on the current project today"
        },
        {
            name: "week",
            alias: "w",
            type: Boolean,
            description: "Display time spent on the current project this week"
        },
        {
            name: "option",
            alias: "o",
            type: String,
            description: "Get an option. Set it if --value is used"
        },
        {
            name: "project",
            alias: "p",
            type: String,
            description: "Display this text"
        },
        {
            name: "value",
            type: String,
            //multiple: true,
            description: "New value of an option"
        },
        {
            name: "period",
            alias: "P",
            type: String,
            //multiple: true,
            description: "Specify a period to show the time spent (format \"YYYY-MM-DD\")"
        },
        {
            name: "verbose",
            alias: "V",
            type: Boolean,
            description: "Make output more verbose"
        }
    ];

    const usageOptions = {
        title: info.name,
        description: info.description,
        synopsis: [
            "$ sand-glass [bold]{--start} [[bold]{--project} [underline]{projectName}]",
            "$ sand-glass [bold]{--option}",
            "$ sand-glass [bold]{--option} [bold]{--value} [underline]{newValue}",
            "$ sand-glass [bold]{--help}"
        ]
    };

    let cli = commandLineArgs(cliOptions);

    that.init = () => {
        let sockets = [];
        let replServer;

        let server = net.createServer(function(socket) {
            sockets.push(socket);

            replServer = nodeREPL.start({
                prompt: "",
                input: socket,
                output: socket,
                eval: evalCmd
            });

            replServer.on("exit", function() {
                socket.end();
            });

        });

        try {
            fs.unlinkSync("/tmp/sand-glass-sock");
        } catch (e) {
        }

        server.listen("/tmp/sand-glass-sock");

        app.on("quit", function() {
            for (let socket of sockets) {
                socket.end();
            }

            if (replServer) {
                replServer.close();
            }

            server.close();
        });
    };

    function evalCmd(cmd, context, filename, callback) {
        let args = spawnargs(cmd.trim());
        args = args.map((value) => {
            return value.replace(/^['"]|['"]$/g, "");
        });

        let options = {};

        try {
            options = cli.parse(args);
        } catch (e) {
            if (e.name === "UNKNOWN_OPTION") {
                let output = cli.getUsage(usageOptions);
                callback(null, output);
            } else {
                console.error(e);
            }
            return;
        }

        if (args[0] === "" || options.help) {
            let output = cli.getUsage(usageOptions);
            callback(null, output);
            return;
        }

        if (options.version) {
            let output = info.longVersion;
            callback(null, output);
            return;
        }

        let result = dispatchAction(options);
        callback(null, result);
    }

    function dispatchAction(options) {

        if (options.start) {
            return start(options.project, options);
        }

        if (options.stop) {
            return stop(options.project, options);
        }

        if (options.day) {
            return showDayTime(options.project, options.period, options);
        }

        if (options.week) {
            return showWeekTime(options.project, options.period, options);
        }

        if (options.option) {
            return setSettings(options);
        }
    }

    function start(project, options) {
        db.start(project);

        let startTime = options.verbose ? ` at ${ansiWrap("underline", time.formatTime(Date.now()))}` : "";

        if (project) {
            return `Clock started for the project ${ansiWrap("bold", project)}${startTime}`;
        } else {
            return `Clock started${startTime}`;
        }
    }

    function stop(project, options) {
        db.stop(project);

        let stopTime = options.verbose ? ` at ${ansiWrap("underline", time.formatTime(Date.now()))}` : "";

        if (project) {
            return `Clock stopped for the project ${ansiWrap("bold", project)}${stopTime}`;
        } else {
            return `Clock stopped${stopTime}`;
        }
    }

    function showDayTime(project, period, options) {
        project = project || settings.projectToShowInTray();
        period = period || time.formatDay(Date.now());

        let duration = time.getDurationForDay(project, period);
        let totalTime = time.formatDuration(duration);
        let result = totalTime;

        if (options.verbose) {
            let segments = time.getSegmentsForDay(project, period);

            result = ansiWrap("bold", period) + `: ${totalTime}`;

            if (segments.length) {
                result += "\n\n";
            }

            let data = segments.map((segment) => {
                return [
                    time.formatTime(segment.start()),
                    time.formatTime(segment.end()),
                    time.formatDuration(segment.delta())
                ];
            });

            result += buildTable(["From", "To", "Time"], data);
        }

        return result;
    }

    function showWeekTime(project, period) {
        project = project || settings.projectToShowInTray();
        period = period || time.formatDay(Date.now());

        let weekNumber = helper.getWeekIndex(period);
        let year = helper.getYearIndex(period);

        let duration = time.getDurationForWeek(project, weekNumber, year);
        return time.formatDuration(duration);
    }

    function setSettings(options) {
        let key = options.option;

        let fn = settings[key];

        if (!fn) {
            return `Unknown setting "${key}"`;
        }

        let message;

        if (options.value) {
            let args = sanitizeValue(options.value);
            fn.apply(null, [args]);
            message = `Option ${key} set to ${args}`;
        } else {
            message = fn.apply(null, []);
        }

        return message;
    }

    function sanitizeValue(value) {
        if (!isNaN(value)) {
            return +value;
        }

        switch (value.toLowerCase()) {
            case "true":
                return true;
            case "false":
                return false;
            case "undefined":
                return undefined;
            case "null":
                return null;
            default:
                return value;
        }
    }

    function ansiWrap(style, string) {
        return ansi[style].open + string + ansi[style].close;
    }

    function buildTable(headers, data) {
        var table = new Table({
            chars: {
                "top": "═",
                "top-mid": "╤",
                "top-left": "╔",
                "top-right": "╗",
                "bottom": "═",
                "bottom-mid": "╧",
                "bottom-left": "╚",
                "bottom-right": "╝",
                "left": "║",
                "left-mid": "╟",
                "mid": "─",
                "mid-mid": "┼",
                "right": "║",
                "right-mid": "╢",
                "middle": "│"
            },
            colAligns: ["middle", "middle", "middle"],
            style: {
                head: ["bold", "blue"]
            },
            head: headers
        });

        table.push.apply(table, data);

        return table.toString();
    }

    return that;
}

module.exports = repl();
