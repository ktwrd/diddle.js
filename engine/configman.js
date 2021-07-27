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

class diddleConfig {
	manifest = {
		version: '0.1b',
		name: 'diddle.js/configman'
	}
	log = new Logger(this.diddle,this.manifest.name);
	constructor(diddle,_config) {
		this.config = extend({},DefaultConfig,_config);
		this.diddle = diddle;

		this.locale = this.diddle.locale.switch(this.config.locale);
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
	}

	get(datapoint) {
		if (datapoint == undefined) throw new Error(this.locale.placeholders.objectUndefined.replace("%s","datapoint"))
		if (this._config[datapoint] == undefined) throw new Error(this.locale.placeholders.objectChildUndefined.replace("%s",datapoint).replace("%s","this._config"));
		return this._config[datapoint];
	}

	set(datapoint,data) {
		if (datapoint == undefined) throw new Error(this.locale.placeholders.objectUndefined.replace("%s","datapoint"))
		if (data == undefined) throw new Error(this.locale.placeholders.objectUndefined.replace("%s","data"));
	}
}
module.exports = diddleConfig;