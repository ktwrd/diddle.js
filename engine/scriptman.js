const fs = require("fs");
const path = require("path");
const EngineScript = require("./enginescript");

const manifest = {
	version: '0.1b',
	name: 'diddle.js/scriptman'
}

class ScriptManager extends EngineScript{

	_fetchScripts() {
		var config = this.diddle.config.get();

		var timestamp_start = Date.now();

		this.log.info(`fetching scripts...`);

		var scriptsdirectory = config.scripts_directory;

		if (!fs.existsSync(scriptsdirectory)) {
			try {
				fs.mkdirSync(scriptsdirectory)
			} catch(e) {
				this.log.error(`cannot create scripts directory\n`,e);
				process.exit(1);
			}
			this.log.info(`created scripts directory`);
		}

		// Get Script Files
		var scripts_filenames,scripts_filtered = [];

		try {
			scripts_filenames = fs.readdirSync(scriptsdirectory).filter(f => f.endsWith(".js"));
		} catch(e) {
			this.log.error(`cannot fetch scripts directory\n`,e);
			process.exit(1);
		}

		var ScriptScheme = {
			manifest: {
				author: 'r',
				license: 'r',
				source: 'o',
				type: 'r',
				filename: 'r',
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
							this.log.error(skipReason);
							doSkipScript = true;
						}
					}
				} else {
					this.log.warn(`no events found for script '${scripts_filenames[j]}'`);
				}

				// Check Script Manifest
				if (currentscript.manifest != undefined && doSkipScript == false) {
					ValidScript.manifest = {};

					currentscript.manifest.filename = path.join(scriptsdirectory,scripts_filenames[j]);

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
									this.log.error(skipReason);
									break;
								case 'o':
								case 0:
									this.log.warn(`missing optional script manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'`);
									break;
							}
						} 
						// Check Manifest Entry Type
						else if (typeof currentscript.manifest[c_manifestobj[0]] != typeof c_manifestobj[1]) {
							switch (c_manifestobj[1]) {
								case 'r':
									doSkipScript = true;
									skipReason = `invalid type manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'. skipping...`;
									this.log.error(skipReason);
									break;
								case 'o':
									this.log.warn(`invalid type manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'`);
									break;
							}
						} 
						// Manifest Entry Exists and is matching type of scheme
						else {
							this.log.debug(`valid manifest entry '${c_manifestobj[0]}' for script '${currentscript_fname}'`);
							ValidScript.manifest[c_manifestobj[0]] = currentscript.manifest[c_manifestobj[0]];
						}
					}

					if (currentscript.manifest.type == undefined && doSkipScript == false) {
						this.log.warn(`manifest type is undefined, assuming as 'library'`);
						ValidScript.manifest.type = ValidScript.manifest.type || 'library';
					}
				} else if (currentscript.manifest == undefined) {
					skipReason = `manifest for script '${currentscript_fname}' is undefined`;
					doSkipScript = true;
					this.log.error(skipReason);
				}

				if (doSkipScript == false) {
					scripts_filtered.push(ValidScript);
				}
			} catch(e) {
				this.log.error(`cannot get script\n`,e);
				process.exit(1);
			}
		}
		if (scripts_filtered.length < 1) {
			this.log.error(`no valid scripts found, aborting!`);
			process.exit(1);
		} else {
			this.log.info(`${scripts_filtered.length} script${scripts_filtered.length == 1 ? "":"s"} found. took ${Date.now() - timestamp_start}ms`);
		}

		this.scripts = scripts_filtered;

		this._parseEvents();
	}

	async _parseEvents() {
		this.log.info("parsing scripts");

		for ( let i = 0; i < this.scripts.length; i++ ) {
			var c_script = this.scripts[i];

			this._parseEventScript(c_script);
		}

		this.diddle.event.call('scripts-ready');
	}

	_parseEventScript(script) {
		if (script.manifest.type != 'event') return;
		if (script.event == undefined) return this.log.error(this.diddle.locale.get("placeholder.scriptEventUndefined").replace("%s",script.manifest.filename));

		var scriptEvents = Object.entries(script.event);

		for (let i = 0; i < scriptEvents.length; i++) {
			let event = scriptEvents[i];
			if (event[0] == 'onload') {
				this.diddle.event.on('scripts-onload',event[1]);
			} else {
				this.diddle.event.on(event[0],event[1]);
			}
		}
	}

	_ready() {
		this._fetchScripts();
	}

	constructor(diddle) {
		super(diddle,manifest);
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
	}
}
module.exports = ScriptManager;