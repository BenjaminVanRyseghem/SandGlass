const electron = require("electron");
const app = electron.app;

const settings = require("./settings");
const db = require("./db");

const net = require('net');
const nodeREPL = require('repl');

function repl() {
    "use strict";

    let that = {};

    that.init = () => {
        let sockets = [];
        let replServer;

        app.on("quit", function() {
            for (let socket of sockets) {
                socket.end();
            }

            if (replServer) {
                replServer.close();
            }
        });

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
            server.close();
        })
    };

    function evalCmd(cmd, context, filename, callback) {
        cmd = cmd.trim();

        let args = cmd.split(" ");
        let head = args.shift();

        if (head == "") {
            callback(null, "URLs should at least have one segment, `start`, `stop`, or `settings`");
            return;
        }

        let result = dispatchAction(head, args);
        callback(null, result);
    }

    function dispatchAction(head, args) {
        switch (head.toLowerCase()) {
            case "start":
                return start(args);
                break;
            case "stop":
                return stop(args);
                break;
            case "settings":
                return setSettings(args);
                break;
            default:
                return `First url segment should be "start", "stop", or "settings", not "${head}"`;
        }
    }

    function start(options) {
        db.start(options[0]);

        if (options[0]) {
            return `Clock started for the project "${options[0]}"`;
        } else {
            return "Clock started";
        }
    }

    function stop(options) {
        db.stop(options[0]);

        if (options[0]) {
            return `Clock stopped for the project "${options[0]}"`;
        } else {
            return "Clock stopped";
        }
    }

    function setSettings(options) {
        if (options.length < 2) {
            return "Settings options should at least be 2 parts";
        }

        let key = options.shift();

        var fn = settings[key];

        if (!fn) {
            return `Unknown setting "${key}"`;
        }

        fn.apply(null, options.map(sanitizeValue));

        return `Setting ${key} set`;
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
