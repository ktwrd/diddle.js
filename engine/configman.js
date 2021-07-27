const DefaultConfig = require("./diddle.config.default.json");
const Logger = require("./logger")

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

class ConfigurationManager {
	manifest = {
		version: '0.1b',
		name: 'diddle.js/configman'
	}
	async _ready() {
		this.config = await extend({},DefaultConfig,this._config);

		this.locale = this.diddle.locale.switch(this.config.locale);
	}
	constructor(diddle,_config) {
		this.diddle = diddle;
		this.config = _config;
		this.log = new Logger(this.diddle,this.manifest.name);
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
	}

	get() {
		return this.config;
	}
}
module.exports = ConfigurationManager;