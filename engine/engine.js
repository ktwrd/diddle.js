const ScriptManager = require("./scriptman.js");
const LogUtil = require("./logger.js")
const LocaleManager = require("./locale.js");
const ConfigurationManager = require("./configman.js");
const EventManager = require("./eventman");
const DiscordWrapper = require("./discord");

class diddle {

	manifest = {
		version: '0.3b',
		name: 'diddle.js/engine',
		requires: [
			'diddle.js/loader@0.1b',
			'diddle.js/scriptman@0.1b',
			'diddle.js/configman@0.1b',
			'diddle.js/locale@0.1b',
			'diddle.js/eventman@0.1b',
			'diddle.js/discord@0.1b'
		]
	}

	_eventchannels = {
		/*
		<channel>: function[]
		*/
	};


	_isJSON(obj) {
		return new Promise((res) => {
			try {
				let t = JSON.stringify(obj);
			} catch(e) {
				res(false);
			}
			res(true);
		})
	}
	locale = null;
	config = null;
	discord = null;

	_wrapperPopulate() {
		var diddle = this;
		this.locale = new LocaleManager(diddle);
		this.config = new ConfigurationManager(diddle,this._config);
		this.discord = new DiscordWrapper(diddle);
		this.scripts = new ScriptManager(diddle);

		this.config._ready();
		this.scripts._ready();
		this.discord._ready();
	}
	constructor(diddleconfig,debug) {
		this.debug = debug;
		if (!this._isJSON(diddleconfig)) {
			throw new Error("Configuration is not JSON");
		}
		this.event = new EventManager(this);
		this.log = new LogUtil(this,this.manifest.name);

		this._config = diddleconfig;

		this.log = new LogUtil(this,"diddle.js/engine");
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version} ${this.debug ? '(Debug Mode Enabled)' : ''}`);

		this._wrapperPopulate();
	}
		
}
module.exports = diddle;