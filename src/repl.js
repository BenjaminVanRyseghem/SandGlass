const electron = require("electron");
const app = electron.app;

const settings = require("./settings");
const db = require("./db");
const info = require("./info");

const net = require("net");
const nodeREPL = require("repl");
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
        }
    ];

    const usageOptions = {
        title: info.name,
        description: info.description,
        synopsis: [
            '$ example [[bold]{--timeout} [underline]{ms}] [bold]{--src} [underline]{file} ...',
            '$ example [bold]{--help}'
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
        cmd = cmd.trim();
        let args = cmd.split(" ");
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

    function setSettings(options) {
        let key = options.option;

        let fn = settings[key];

        if (!fn) {
            return `Unknown setting "${key}"`;
        }

        let message;

        if (options.value) {
            let args = sanitizeValue(options.value);
            fn.apply(null, args);
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
                return value
        }
    }

    return that;
}

module.exports = repl();
