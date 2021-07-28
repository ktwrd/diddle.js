const path = require("path");
const fs = require("fs");
const toolbox = require("tinytoolbox");
const EngineScript = require("./enginescript");

const manifest = {
	version: '0.1b',
	name: 'diddle.js/locale'
}

function extend(target) {
	var sources = [].slice.call(arguments, 1);
	sources.forEach(function (source) {
		for (var prop in source) {
			target[prop] = source[prop];
		}
	});
	return target;
}

/**
 * @typedef LocaleManager.LocaleCode
 * @type {string}
 * @description Locale Codes must be formatted as <code>[<a href="https://en.wikipedia.org/wiki/ISO_639-1">ISO 639-1</a>]_[<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>]</code>. So, for example the Default Locale Code is <code>en_US</code>
 */

/**
 * @class LocaleManager
 * @description Used for managing localization files stored in <code>engine/locale/</code>
 * @argument {DiddleEngine} diddle
 */
class LocaleManager extends EngineScript {
	
	cache = {
		/*
		<locale>: {
			placeholders: {}, // Things that have %s which get replaced
			// all the other things would go here
		}
		*/
	};

	currentLocaleCode_default = "en_US";
	currentLocaleCode = this.currentLocaleCode_default;

	_fetch(_localeName) {
		var _localePath = path.join(this._localeDirectory,_localeName+".json");

		if (fs.existsSync(_localePath)) {
			// Locale Exists
			return JSON.parse(fs.readFileSync(_localePath));
		} else {
			// Locale does not exist
			throw new Error(`Locale does not exist at '${_localePath}'`);
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

	/**
	 * @param {LocaleManager.LocaleCode} _localeName Locale Code to Switch to. If <code>undefined</code> will switch to the Default Locale (<code>en_US</code>)
	 */
	switch(_localeName) {
		if (_localeName == undefined) throw new Error("Locale is undefined");
		this.currentLocaleCode = _localeName;
		// Reload locale cache before setting the currentLocale to the one we desire.
		this._reload();
		if (this.cache[_localeName] == undefined) throw new Error("Locale does not exist");
		this.currentLocale = this.cache[_localeName];
		this.log.debug(`switched locale to; ${this.currentLocaleCode}`);
	}

	/**
	 * @param {LocaleManager.LocaleCode} _entry Locale Code to Get. If <code>undefined</code> will return the Current Locale.
	 * @returns {LocaleData}
	 */
	get(_entry) {
		_entry = _entry || this.currentLocaleCode;
		return this.currentLocale[_entry];
	}
	constructor(diddle) {
		super(diddle,manifest);
		this._localeDirectory = path.join(__dirname,'locale');

		this.currentLocale = this.currentLocaleCode_default;
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
	}
}
module.exports = LocaleManager;