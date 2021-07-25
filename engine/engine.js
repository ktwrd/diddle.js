const ScriptManager = require("./scriptman.js");
const StatisticsWrapper = require("./statistics.js");

class diddle {

	manifest = {
		version: '0.1b',
		name: 'diddle.js/engine',
		requires: [
			'diddle.js/loader@0.1b',
			'diddle.js/scpman@0.1b'
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

	dlog(...d) {
		if (this.debug) {
			console.debug(d.join(' '));
		}
	}

	constructor(diddleconfig) {
		if (!this._isJSON(diddleconfig)) {
			throw new Error("Configuration is not JSON");
		}

		this.debug = diddleconfig.debug != undefined && diddleconfig.debug == true;
		dlog(`Running ${this.manifest.name}@${this.manifest.version} ${this.debug ? '(Debug Mode Enabled)' : ''}`);
	}
}
module.exports = diddle;