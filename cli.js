#!node
module.exports = {
	version: '0.1b',
	name: 'diddle.js/loader',
	requires: [
		'diddle.js/engine@0.1b'
	]
}

const fs = require("fs");

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

var CustomConfigData = {};

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

// Fetch User Scripts
( () => {
	var timestamp_start = Date.now();

	dlog.i(`fetching scripts...`);

	var scriptsdirectory = LaunchParameters["script-directory"] || CustomConfigData.scripts_directory || "./scripts/";

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
	var scripts_unfiltered,scripts_filenames,scripts_filtered = [];

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
			source: 'o',
			type: 'r'
		},
		event: {},
	}
	for ( let j = 0; j < scripts_filenames.length; j++ ) {
		try {
			let currentscript = require(`${scriptsdirectory}${scripts_filenames[j]}`);

			let currentscript_fname = scripts_filenames[j];

			var ValidScript = { };

			var doSkipScript = false;
			var skipReason = null;

			// Check Event Object
			if (currentscript.event != undefined) {
				ValidScript.event = {};
				var eventobjs = Object.entries(currentscript.event)
				for (let i = 0; i < eventobjs.length; i++) {
					if (typeof eventobjs[i][1] == "function") {
						ValidScript.event[eventobjs[i][0]] = eventobjs[i][1];
					} else {
						skipReason = `event '${eventobjs[i][0]}' for script '${scripts_filenames[j]}' has typeof '${typeof eventobjs[i][1]}'. expected typeof 'function'. skipping script...`
						dlog.e(skipReason);
						doSkipScript = true;
					}
				}
			} else {
				dlog.w(`no events found for script '${scripts_filenames[j]}'`);
			}

			// Check Script Manifest
			if (currentscript.manifest != undefined && doSkipScript == false) {
				ValidScript.manifest = {};
				var manifestobjs = Object.entries(ScriptScheme.manifest);

				for (let i = 0; i < manifestobjs.length; i++) {
					var c_manifestobj = manifestobjs[i];

					// Check if Manifest Entry Exists
					if (currentscript.manifest[c_manifestobj[0]] == undefined) {
						switch (c_manifestobj[1]) {
							case 'r':
							case 1:
								doSkipScript = true;
								skipReason = `missing required script manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'. skipping...`
								dlog.e(skipReason);
								break;
							case 'o':
							case 0:
								dlog.w(`missing optional script manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'`);
								break;
						}
					} 
					// Check Manifest Entry Type
					else if (typeof currentscript.manifest[c_manifestobj[0]] != typeof c_manifestobj[1]) {
						switch (c_manifestobj[1]) {
							case 'r':
								doSkipScript = true;
								skipReason = `invalid type manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'. skipping...`;
								dlog.e(skipReason);
								break;
							case 'o':
								dlog.w(`invalid type manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'`);
								break;
						}
					} 
					// Manifest Entry Exists and is matching type of scheme
					else {
						dlog.d(`valid manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'`);
						ValidScript.manifest[c_manifestobj[0]] = currentscript.manifest[c_manifestobj[0]];
					}
				}

				if (currentscript.manifest.type == undefined && doSkipScript == false) {
					dlog.w(`manifest type is undefined, assuming as 'library'`);
					ValidScript.manifest.type = ValidScript.manifest.type || 'library';
				}
			} else if (currentscript.manifest == undefined) {
				skipReason = `manifest for script '${currentscript_fname}' is undefined`;
				doSkipScript = true;
				dlog.e(skipReason);
			}

			if (doSkipScript == false) {
				scripts_filtered.push(ValidScript);
			}
		} catch(e) {
			dlog.e(`cannot get script\n`,e);
			process.exit(1);
		}
	}

	if (scripts_filtered.length < 1) {
		dlog.e(`no valid scripts found, aborting!`);
		process.exit(1);
	} else {
		dlog.d(`${scripts_filtered.length} script${scripts_filtered.length == 1 ? "":"s"} found. took ${Date.now() - timestamp_start}ms`);
	}
} )();

const diddleInstance = new (require("."))(CustomConfigData);