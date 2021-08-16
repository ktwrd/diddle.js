const ScriptManager = require("./scriptman.js");
const LogUtil = require("./logger.js")
const LocaleManager = require("./locale.js");
const ConfigurationManager = require("./configman.js");
const EventManager = require("./eventman");
const DiscordWrapper = require("./discord");
const EngineExtensionManager = require("./extensionmanager.js");

const path = require("path");
const StorageManager = require("./store.js");
const TokenManager = require("./tokenman.js");
/**
 * @projectname diddle.js
 * @version 0.2.0
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
		name: 'org.js.diddle.engine',
		requires: [
			'org.js.diddle.engine.loader',
			'org.js.diddle.engine.script',
			'org.js.diddle.engine.config',
			'org.js.diddle.engine.locale',
			'org.js.diddle.engine.event',
			'org.js.diddle.engine.discord',
			'org.js.diddle.engine.extension',
			'org.js.diddle.engine.store',
			'org.js.diddle.engine.token'
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

	packages = {
		org: {
			js: {
				diddle: {
					engine: {}
				}
			}
		}
	};

	/** @private */
	_processScriptArray(arr) {
		for (let i = 0; i < arr.length; i++) {
			var currentscript = arr[i];
			if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(currentscript.manifest.name)) {
				let wstring = '';
				var mname = currentscript.manifest.name.split(".");
				for (let j = 0; j < mname.length; j++) {
					var wname = mname[j]
					wstring+="."+wname;
					eval(`this.packages${wstring} = this.packages${wstring} || {};`);
				}
				eval("this.packages."+currentscript.manifest.name+" = currentscript");
				if (currentscript._ready != undefined) {
					currentscript._ready();
				}
			}
		}
	}

	/** @private */
	_wrapperPopulate() {
		this.locale = new LocaleManager(this);

		this._processScriptArray([
			new ConfigurationManager(this,this._config),
			new TokenManager(this),
			new StorageManager(this),
			new EngineExtensionManager(this),
		])
		this._processScriptArray([
			new DiscordWrapper(this),
			new ScriptManager(this),
		])
		this._processScriptArray(this.packages.org.js.diddle.engine.extension.extensions);
		console.log(this.packages)
	}

	/**
	 * @description Get Engine Extension by Package Name. This includes core packages such as <code>org.js.diddle.engine.config</code>.
	 * @param {string} PackageName Must match [Java's Hierarchial Naming Pattern](https://en.wikipedia.org/wiki/Java_package#Package_naming_conventions)
	 * @returns {Array<EngineScript>}
	 */
	get(PackageName) {
		if (PackageName == this.manifest.name) return this;
		// Return an array of objects where the manifest name matches the queries package name
		if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(PackageName)) return undefined;
		return eval("this.packages."+PackageName);
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