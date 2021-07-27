const ScriptManager = require("./scriptman.js");
const LogUtil = require("./logger.js")
const LocaleManager = require("./locale.js");
const ConfigurationManager = require("./configman.js");
const EventManager = require("./eventman")

class diddle {

	manifest = {
		version: '0.1b',
		name: 'diddle.js/engine',
		requires: [
			'diddle.js/loader@0.1b',
			'diddle.js/scriptman@0.1b',
			'diddle.js/configman@0.1b',
			'diddle.js/locale@0.1b',
			'diddle.js/eventman@0.1b'
		]
	}

	log = new LogUtil(this.diddle,this.manifest.name);

	_eventchannels = {
		/*
		<channel>: function[]
		*/
	};

	event = new EventManager(this.diddle);

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
	locale = new LocaleManager(this);
	constructor(diddleconfig) {
		if (!this._isJSON(diddleconfig)) {
			throw new Error("Configuration is not JSON");
		}

		this.debug = diddleconfig.debug != undefined && diddleconfig.debug == true;
		this.log = new LogUtil(this,"diddle.js/engine");
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version} ${this.debug ? '(Debug Mode Enabled)' : ''}`);
	
		this.event.on('locale-ready',() => {
			this.config = new ConfigurationManager(this,diddleconfig);
		})
		this.locale.ready();
	}
		
}
module.exports = diddle;