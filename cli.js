#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

var LaunchParameters = null;

(() => {
    var scrubbed_argv = process.argv;
    // Remove first two objects
    scrubbed_argv.shift(); scrubbed_argv.shift();

    var argvParsed = {};

    for ( let i = 0; i < scrubbed_argv.length; i++ ) {
        var argumentToParse = scrubbed_argv[i].replace("--","");

        if (argumentToParse.split("=").length == 1) {
            argvParsed[argumentToParse.split("=")[0]] = true;
        } else {
            // Set the argument data to everything after the first occurrence of '='
            var parsedData = argumentToParse.split("=");
            parsedData.shift();
            parsedData = parsedData.join('=');
            argvParsed[argumentToParse.split("=")[0]] = parsedData;
        }
    }

    LaunchParameters = argvParsed;
} )();

var CustomConfigData = LaunchParameters;

const dlog = {
    w: (...c) => {
        console.warn(`\x1b[33m\x1b[40mdiddle.js/loader:\x1b[0m ${c.join(' ')}`)
    },
    e: (...c) => {
        console.warn(`\x1b[33m\x1b[40mdiddle.js/loader:\x1b[0m ${c.join(' ')}`)
    },
    d: (...c) => {
        if (LaunchParameters.developer != true) return;
        console.warn(`\x1b[32m\x1b[40mdiddle.js/loader:\x1b[0m ${c.join(' ')}`)
    },
    i: (...c) => {
        console.warn(`\x1b[36m\x1b[40mdiddle.js/loader:\x1b[0m ${c.join(' ')}`)
    }
}

if (LaunchParameters.developer != undefined && LaunchParameters.developer == true) {
    dlog.d(`developer mode enabled!`);
} else {
    /*try {
        require("diddle.js");
    } catch(e) {
        // diddle.js Not installed or running in developer mode
        dlog.e("diddle.js is not installed! try installing with `npm install diddle.js --save`\n",e);
        process.exit(1);
    }*/
}

var DefaultConfigFilename = ["diddle.config.json","diddle.config.js"];

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

if (LaunchParameters.config == undefined) {
    fs.readdirSync("./").forEach((file) => {
        if (containsObject(file,DefaultConfigFilename)) {
            LaunchParameters.config = file;
        }
    })
}

if (LaunchParameters.config != undefined) {
    if (fs.existsSync(LaunchParameters.config)) {
        UseCustomConfig = true;

        CustomConfigData = JSON.parse(fs.readFileSync(LaunchParameters.config));
        CustomConfigData.default = false;
        dlog.i("diddle.js/cli-loader: Using Custom Config");
    }
}

CustomConfigData.scripts_directory = CustomConfigData.scripts_directory || "./scripts/";

CustomConfigData.scripts_directory = path.join(path.resolve(CustomConfigData.scripts_directory),"/")

var DoDebug = LaunchParameters.debug || LaunchParameters.developer || CustomConfigData.developer || CustomConfigData.debug || false;

const diddleInstance = new (require(".")).engine(CustomConfigData, DoDebug);