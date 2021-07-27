const EngineScript = require("./enginescript");
var self;
const manifest = {
	version: '0.1b',
	name: 'diddle.js/eventman'
}
class EventManager extends EngineScript{

	constructor(diddle) {
		super(diddle,manifest);
		this._eventchannels = {}
	}

	on (_channel,..._callbacks) {
		if (this._eventchannels[_channel] == undefined) {
			this._eventchannels[_channel] = [];
		}
		for ( let i = 0; i < _callbacks.length; i++) {
			this._eventchannels[_channel].push(_callbacks[i]);
		}
		this.log.debug(`added event listener for '${_channel}'`);
	}
	call (_channel,_data) {
		if (this._eventchannels[_channel] == undefined) {
			this._eventchannels[_channel] = [];
		}
		this.log.debug(`called event '${_channel}' ${_data != undefined ? "with data of '"+_data+"'": ""}`)
		this._eventchannels[_channel].forEach(c => c(this.diddle,_data || null));
	}
}
module.exports = EventManager;