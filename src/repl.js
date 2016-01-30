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
const spawnargs = require('spawn-args');
const commandLineArgs = require("command-line-args");

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
        }
    ];

    const usageOptions = {
        title: info.name,
        description: info.description,
        synopsis: [
            '$ sand-glass [bold]{--start} [[bold]{--project} [underline]{projectName}]',
            '$ sand-glass [bold]{--option}',
            '$ sand-glass [bold]{--option} [bold]{--value} [underline]{newValue}',
            '$ sand-glass [bold]{--help}'
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
            return value.replace(/^['"]|['"]$/g, '');
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
            return start(options.project);
        }

        if (options.stop) {
            return stop(options.project);
        }

        if (options.day) {
            return showDayTime(options.project, options.period);
        }

        if (options.week) {
            return showWeekTime(options.project, options.period);
        }

        if (options.option) {
            return setSettings(options);
        }
    }

    function start(project) {
        db.start(project);

        if (project) {
            return `Clock started for the project "${project}"`;
        } else {
            return "Clock started";
        }
    }

    function stop(project) {
        db.stop(project);

        if (project) {
            return `Clock stopped for the project "${project}"`;
        } else {
            return "Clock stopped";
        }
    }

    function showDayTime(project, period) {
        project = project || settings.projectToShowInTray();
        period = period || time.formatDay(Date.now());

        let duration = time.getDurationForDay(project, period);
        return time.formatDuration(duration);
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

    return that;
}

module.exports = repl();
