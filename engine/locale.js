const path = require("path");
const fs = require("fs");
const toolbox = require("tinytoolbox");

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

class LocaleManager {
	manifest = {
		version: '0.1b',
		name: 'diddle.js/locale'
	}
	cache = {
		/*
		<locale>: {
			placeholders: {}, // Things that have %s which get replaced
			// all the other things would go here
		}
		*/
	};

	currentLocaleCode_default = "en_US";
	currentLocaleCode = currentLocaleCode_default;

	_fetch(_localeName) {
		var _localePath = path.join([this._localeDirectory,_localeName+".json"]);

		if (fs.existsSync(_localePath)) {
			// Locale Exists
			return JSON.parse(fs.readFileSync(_localePath));
		} else {
			// Locale does not exist
			throw new Error(this.current.placeholder.missingFile.replace("%s",_localePath));
		}
	}
	_reload() {
		toolbox.async.forEach(fs.readdirSync(this._localeDirectory),(_file) => {
			if (!_file.endsWith(".json")) return;
			this.cache[_file.replace(".json","")] = require("./locale/"+_file);
		});
	}
	_set(_targetLocale) {
		// Return the merged locale of target locale into default locale
		var newLocale = extend({},this.cache[this.currentLocaleCode],this.cache[this.currentLocaleCode_default]);
		this.currentLocaleCode = _targetLocale;
		this.currentLocale = newLocale;
		return newLocale;
	}
	switch(_localeName) {
		if (_localeName == undefined) throw new Error("Locale is undefined");
		this.currentLocaleCode = _localeName;
		// Reload locale cache before setting the currentLocale to the one we desire.
		this._reload();
		if (this.cache[_localeName] == undefined) throw new Error("Locale does not exist");
		this.currentLocale = this.cache[_localeName];
	}
	constructor(diddle) {
		this.diddle = diddle;
		this._localeDirectory = path.join([__dirname,'locale']);

		this.currentLocale = diddle.config.get('locale')
	}
}
module.exports = LocaleManager;