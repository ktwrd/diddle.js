const ScriptManager = require("./scriptman.js");
const LogUtil = require("./logger.js")
const LocaleManager = require("./locale.js");
const ConfigurationManager = require("./configman.js");
const EventManager = require("./eventman");
const DiscordWrapper = require("./discord");
const EngineExtensionManager = require("./extensionmanager.js");

const path = require("path");
const StorageManager = require("./store.js");
/**
 * @projectname diddle.js
 * @version 0.1.1
 */
/**
 * diddle.js Engine
 * @class
 * @property {number} startTimestamp startTimestamp The UNIX Timecode of when the DiddleEngine was invoked (ms)
 * @property {string} directory Base directory of where <code>diddlejs</code> was ran from.
 */
class DiddleEngine {
	/**
	 * @type {EngineScript.manifest}
	 */
	manifest = {
		version: require("./../package.json").version,
		name: 'diddle.js/engine',
		requires: [
			'diddle.js/loader@0.1b',
			'diddle.js/scriptman@0.1b',
			'diddle.js/configman@0.1b',
			'diddle.js/locale@0.1b',
			'diddle.js/eventman@0.1b',
			'diddle.js/discord@0.1b',
			'diddle.js/extman@0.1b',
			'diddle.js/store@0.1'
		]
	}

	directory = path.resolve("./");

	startTimestamp = Date.now()

	_eventchannels = {
		/*
		<channel>: function[]
		*/
	};


	/** @private */
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
	/**
	 * @type {LocaleManager}
	 */
	locale = null;
	/**
	 * @type {ConfigurationManager}
	 */
	config = null;
	/**
	 * @type {DiscordWrapper}
	 */
	discord = null;
	/**
	 * @type {ScriptManager}
	 */
	scripts = null;

	/** @private */
	_wrapperPopulate() {
		var diddle = this;
		this.locale = new LocaleManager(diddle);
		this.config = new ConfigurationManager(diddle,this._config);
		this.discord = new DiscordWrapper(diddle);
		this.scripts = new ScriptManager(diddle);
		this.ext = new EngineExtensionManager(diddle);
		this.store = new StorageManager(diddle);

		this.config._ready();
		this.ext._ready();
		this.scripts._ready();
		this.discord._ready();
		this.store._ready();
	}
	/**
	 * @constructor
	 * @param {ConfigurationManager.config} diddleconfig User configuration, gets merged with <code>engine/diddle.config.default.json</code> to make sure that the required values are populated.
	 * @param {bool} debug Whether to enable debug logging
	 */
	constructor(diddleconfig,debug) {
		this.debug = debug;
		if (!this._isJSON(diddleconfig)) {
			throw new Error("Configuration is not JSON");
		}
		this.event = new EventManager(this);
		this.log = new LogUtil(this,this.manifest.name);

		this._config = diddleconfig;

		this.log = new LogUtil(this,"diddle.js/engine");
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version} ${this.debug ? '(Debug Mode Enabled)' : ''}`);

		this._wrapperPopulate();
	}
}

module.exports = {
	engine: DiddleEngine,
	ScriptManager: require("./scriptman.js"),
	Logger: require("./logger"),
	LocaleManager: require("./locale"),
	Configuration: require("./configman"),
	EventManager: require("./eventman"),
	EngineScript: require("./enginescript"),
	Discord: require("./discord"),
	ExtensionManager: require("./extensionmanager"),
	Extension: require("./extensionscript")
}