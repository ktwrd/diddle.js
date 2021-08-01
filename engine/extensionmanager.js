const EngineScript = require("./enginescript.js");
const ExtensionScript = require("./extensionscript.js");

const manifest = {
	name: "diddle.js/extman",
	version: "0.1b"
}

/**
 * @class
 * @property {string} cwd The absolute directory where all of the custom Engine Extensions live.
 * @extends {EngineScript}
 */
class EngineExtensionManager extends EngineScript {
	/**
	 * @param {DiddleEngine} diddle 
	 */
	constructor(diddle) {
		super(diddle,manifest);
		// Current Working Directory
		this.cwd = '';
	}

	_store = {
		/*
		<ScriptUID>: ExtensionScript
		*/
	}

	/**
	 * @description Add Custom Engine Extension
	 * @param {ExtensionScript} extension 
	 */
	append(extension) {
		this._store[extension._ScriptUID] = extension;
	}

	/**
	 * @description Fetch Extension by its Unique Identifier
	 * @param {string} extension 
	 * @returns {ExtensionScript}
	 */
	getByUID(ScriptUID) {
		if (this._store[ScriptUID] == undefined) throw new Error(this.diddle.locale.get("ScriptExt.FetchFail.ExtensionNotFound"))

		return this._store[ScriptUID];
	}

	/**
	 * @description Returns an Array of all Extensions that match the given name.
	 * @param {*} ScriptName 
	 * @returns {ExtensionScript[]}
	 */
	getByName(ScriptName) {
		return this._score.filter(script => script.manifest.name == ScriptName);
	}
}
module.exports = EngineExtensionManager;