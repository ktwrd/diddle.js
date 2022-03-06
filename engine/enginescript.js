const EventManager = require("./eventman");
const Logger = require("./logger")


/** 
 * @typedef EngineScript.manifest
 * @property {string} name Engine Script Name
 * @property {string} version Version Number of the EngineScript
 */

/**
 * @class EngineScript
 * @property {DiddleEngine} diddle Discord.JS Client
 * @property {Logger} log
 * @property {EventManager} event
 * @param {DiddleEngine} diddle
 * @param {EngineScript.manifest} manifest
 */
class EngineScript {
    constructor(diddle,manifest) {
        this.diddle = diddle;
        this.manifest = manifest;
        this.log = new Logger(this.diddle,this.manifest.name);
        this.event = new EventManager(this.diddle);
    }
}
module.exports = EngineScript;