module.exports = {
	version: '0.1b',
	name: 'diddle.js/loader',
	requires: [
		'diddle.js/engine@0.0.1'
	]
}


var LaunchParameters = null;

( () => {
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
const packagejson = require("./package.json");
if (packagejson.dependencies["diddle.js"] == undefined && (LaunchParameters.developer == undefined && !LaunchParameters.developer)) {
	// diddle.js Not installed or running in developer mode
	dlog.e("diddle.js is not installed! try installing with `npm install diddle.js --save`");
	process.exit(1);
}

if (LaunchParameters.developer != undefined && LaunchParameters.developer == true) {
	dlog.i(`developer mode enabled!`);
}

// Fetch User Scripts
( () => {
	dlog.d(`fetching scripts...`);
	const fs = require("fs");

	var scriptsdirectory = LaunchParameters["script-directory"] || "scripts";

	if (!fs.existsSync(scriptsdirectory)) {
		try {
			fs.mkdirSync(scriptsdirectory)
		} catch(e) {
			dlog.e(`cannot create scripts directory\n`,e);
			process.exit(1);
		}
		dlog.i(`created scripts directory`);
	}

	// Get Script Files
	var scripts_unfiltered,scripts_filenames = [];

	try {
		scripts_filenames = fs.readdirSync(scriptsdirectory).filter(f => f.endsWith(".js"));
	} catch(e) {
		dlog.e(`cannot fetch scripts directory\n`,e);
		process.exit(1);
	}

	var ScriptScheme = {
		manifest: {
			author: 'r',
			license: 'r',
			source: 'o'
		},
		event: {},
	}

	for ( let j = 0; j < scripts_filenames.length; j++ ) {
		try {
			let currentscript = require(`${scriptsdirectory == "scripts" ? "./scripts/" : scriptsdirectory}${scripts_filenames[j]}`);

			var ValidScript = { };

			// Check Event Object
			if (currentscript.event != undefined) {
				ValidScript.event = {};
				var eventobjs = Object.entries(currentscript.event)
				for (let i = 0; i < eventobjs.length; i++) {
					if (typeof eventobjs[i][1] == "function") {
						ValidScript.event[eventobjs[i][0]] = eventobjs[i][1];
					} else {
						dlog.w(`event '${eventobjs[i][0]}' for script '${scripts_filenames[j]}' has the typeof '${typeof eventobjs[i][1]}'. expected typeof 'function'`);
					}
				}
			}

			if (currentscript.manifest != undefined) {
				ValidScript.manifest = {};
				var manifestobjs = Object.entries(currentscript.manifest);

				for (let i = 0; i < manifestobjs.length; i++) {
					if (typeof manifestobjs[i][1] == typeof ScriptScheme.manifest[manifestobjs[i][0]]) {
						ValidScript.manifest[manifestobjs[i][0]] = manifestobjs[i][1];
					} else {
						dlog.w(`manifest item '${manifestobjs[i][0]}' for script '${scripts_filenames[j]}' has typeof '${typeof manifestobjs[i][1]}'. expected typeof '${typeof ScriptScheme.manifest[manifestobjs[i][0]]}'`)
					}
				}
			}

		} catch(e) {
			dlog.e(`cannot get script\n`,e);
			process.exit(1);
		}
	}

} )();
