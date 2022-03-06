const EngineScript = require("./enginescript")
const crypto = require("crypto")

/**
 * @class
 * @property {string} _ScriptUID MD5 Sum of the Extensions Manifest Name and Version seperated by <code>@</code>
 * @extends {EngineScript}
 */
class ExtensionScript extends EngineScript {
    /**
     * @param {DiddleEngine} diddle 
     * @param {EngineScript.manifest} manifest 
     */
    constructor(diddle,manifest) {
        super(diddle,manifest);
        this._ScriptUID = crypto.createHash("md5").update(manifest.name + "@" + manifest.version).digest("hex");
        this.diddle.pacman.get("org.js.diddle.engine.extension").append(this);
    }

}
module.exports = ExtensionScript;