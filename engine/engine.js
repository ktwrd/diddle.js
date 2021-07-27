const ScriptManager = require("./scriptman.js");
const LogUtil = require("./logger.js")
const LocaleManager = require("./locale.js");
const ConfigurationManager = require("./configman.js");

class diddle {

	manifest = {
		version: '0.1b',
		name: 'diddle.js/engine',
		requires: [
			'diddle.js/loader@0.1b',
			'diddle.js/scriptman@0.1b',
			'diddle.js/configman@0.1b',
			'diddle.js/locale@0.1b'
		]
	}

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

	log = new LogUtil(this);
	
	constructor(diddleconfig) {
		if (!this._isJSON(diddleconfig)) {
			throw new Error("Configuration is not JSON");
		}

		this.debug = diddleconfig.debug != undefined && diddleconfig.debug == true;
		this._log = new LogUtil(this,"diddle.js/engine");
		log.debug(`Running ${this.manifest.name}@${this.manifest.version} ${this.debug ? '(Debug Mode Enabled)' : ''}`);
	}
}
module.exports = diddle;