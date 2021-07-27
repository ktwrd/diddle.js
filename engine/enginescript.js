const Logger = require("./logger")

class EngineScript {
	constructor(diddle,manifest) {
		this.diddle = diddle;
		this.manifest = manifest;
		this.log = new Logger(this.diddle,this.manifest.name);
	}
}
module.exports = EngineScript;