const Logger = require("./logger");

const manifest = {
	version: '0.1b',
	name: 'diddle.js/eventman'
}
/**
 * @class EventManager
 * @property {EngineScript.Manifest} manifest
 */
class EventManager {

	constructor(diddle) {
		this.diddle = diddle;
		this._eventchannels = {}
		this.log = new Logger(diddle,"diddle.js/eventman");
		this.manifest = manifest;
	}
	/**
	 * Listen to an event on specified channel.
	 * @param {string} _channel 
	 * @param  {...function} _callbacks 
	 */
	on (_channel,..._callbacks) {
		if (this._eventchannels[_channel] == undefined) {
			this._eventchannels[_channel] = [];
		}
		for ( let i = 0; i < _callbacks.length; i++) {
			this._eventchannels[_channel].push(_callbacks[i]);
		}
		this.log.debug(`added event listener for '${_channel}'`);
	}
	/**
	 * Invoke Event to the specified channel.
	 * @param {string} _channel 
	 * @param {*} _data 
	 */
	call (_channel,_data) {
		if (this._eventchannels[_channel] == undefined) {
			this._eventchannels[_channel] = [];
		}
		this.log.debug(`called event '${_channel}' `,_data || '');
		this._eventchannels[_channel].forEach(c => c(this.diddle,_data || null));
	}
}
module.exports = EventManager;