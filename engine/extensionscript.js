const diddle = require("./engine")
const crypto = require("crypto")

/**
 * @class
 * @property {string} _ScriptUID MD5 Sum of the Extensions Manifest Name and Version seperated by <code>@</code>
 * @extends {EngineScript}
 */
class ExtensionScript extends diddle.EngineScript {
	/**
	 * 
	 * @param {DiddleEngine} diddle 
	 * @param {EngineScript.manifest} manifest 
	 */
	constructor(diddle,manifest) {
		super(diddle,manifest);
		this._ScriptUID = crypto.createHash("md5").update(manifest.name + "@" + manifest.version).digest("hex");
		this.diddle.ext.append(this);
	}

}
module.exports = ExtensionScript;