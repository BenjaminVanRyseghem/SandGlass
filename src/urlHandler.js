const electron = require("electron");
const app = electron.app;

const settings = require("./settings");
const db = require("./db");

function urlHandler() {
    "use strict";

    let that = {};

    that.init = () => {
        app.on("open-url", urlHandler);
    };

    function urlHandler(event, url) {
        let args = url.split("://").pop().split("/");
        let head = args.shift();

        if (head == "") {
            console.error("URLs should at least have one segment, `start`, `stop`, or `settings`");
            return;
        }

        switch (head.toLowerCase()) {
            case "start":
                start(args);
                break;
            case "stop":
                stop(args);
                break;
            case "settings":
                setSettings(args);
                break;
            default:
                console.error("First url segment should be `start`, `stop`, or `settings`");
        }
    }

    function start(options) {
        db.start(options[0]);
    }

    function stop(options) {
        db.stop(options[0]);
    }

    function setSettings(options) {
        if (options.length < 2) {
            console.error("Settings options should at least be 2 parts");
            return;
        }

        let key = options.shift();

        var fn = settings[key];

        if (!fn) {
            console.error(`Unknown setting "${key}"`);
            return;
        }

        fn.apply(null, options.map(sanitizeValue));
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

module.exports = urlHandler();
