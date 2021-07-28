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
	name: 'diddle.js/configman'
}

/**
 * @typedef ConfigurationManager.config
 * @property {bool} disable
 * @property {ConfigurationManager.discordconfig} discord
 * @property {LocaleManager.LocaleCode} locale
 * @property {string} scripts_directory
 * @property {bool} debug
 */
/**
 * @typedef ConfigurationManager.discordconfig
 * @property {string} token Discord Bot Token, If It's a User Token discord.js will reject it
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
	async _ready() {
		this.config = await extend({},DefaultConfig,this._config);

		this.locale = this.diddle.locale.switch(this.config.locale);
	}
	constructor(diddle,_config) {
		super(diddle,manifest);
		this.config = _config;
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