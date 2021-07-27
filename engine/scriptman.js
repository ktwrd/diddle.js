const Logger = require("./logger")

class ScriptManager {

	manifest = {
		version: '0.1b',
		name: 'diddle.js/scriptman'
	}

	log = new Logger(this.diddle,this.manifest.name);
	constructor(diddle) {
		this.diddle = diddle;
	}
}
module.exports = ScriptManager;