

class diddleConfig {

	manifest = {
		version: '0.1b',
		name: 'diddle.js/configman'
	}

	constructor(_config,diddle) {
		this._config = _config;
		this.diddle = diddle;

		this.locale = this.diddle.locale.get(_config.locale || 'en_US');
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