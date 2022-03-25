const EventManager = require("./eventman");
const Logger = require("./logger")

/**
 * @class
 */
class EngineScript {
    /**
     * @param {DiddleEngine} diddle 
     * @param {type$EngineScript.Manifest} manifest 
     */
    constructor(diddle, manifest) {
        this.diddle = diddle;
        this.manifest = manifest;
        this.log = new Logger(this.diddle, this.manifest.name);
        this.event = new EventManager(this.diddle);
    }

    /**
     * @type {DiddleEngine}
     * @default null
     */
    diddle = null;
    /**
     * @type {Logger}
     * @default null
     */
    log = null;
    /**
     * @type {EventManager}
     * @default null
     */
    event = null;

    /**
     * @type {type$EngineScript.Manifest}
     * @default null
     */
    manifest = null;
}
module.exports = EngineScript;