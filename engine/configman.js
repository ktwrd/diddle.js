const DefaultConfig = require("./diddle.config.default.json");
const EngineScript = require("./enginescript")

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
const manifest = {
    version: '0.1b',
    name: 'org.js.diddle.engine.config'
}

/**
 * @typedef ConfigurationManager.config
 * @property {bool} disable
 * @property {ConfigurationManager.discordconfig} discord
 * @property {LocaleManager.LocaleCode} locale
 * @property {string} scripts_directory
 * @property {bool} debug
 * @property {object} token Has children with the object name of the service and the content of either a string, or an array of strings.
 */
/**
 * @typedef ConfigurationManager.discordconfig
 * @property {string[]} admin Discord User ID Snowflakes
 * @property {string} prefix Command Prefix
 */

/**
 * @class ConfigurationManager
 * @extends EngineScript
 * @argument {DiddleEngine} diddle
 * @argument {ConfigurationManager.config} _config
 */
class ConfigurationManager extends EngineScript{
    _ready() {
        this.config = extend({},DefaultConfig,this._config);
        this.locale = this.diddle.locale.switch(this.config.locale);
    }
    constructor(diddle,_config) {
        super(diddle,manifest);
        this._config = _config;
        this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
    }

    /**
     * 
     * @returns {ConfigurationManager.config}
     */
    get() {
        return this.config;
    }
}
module.exports = ConfigurationManager;