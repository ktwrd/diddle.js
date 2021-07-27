const Logger = require("./logger");
var self;
class EventManager {
	manifest = {
		version: '0.1b',
		name: 'diddle.js/eventman'
	}
	
	constructor(diddle) {
		this.diddle = diddle;
		self = this;
		this.log = new Logger(this.diddle,this.manifest.name);
	}

	_eventchannels = {}

	on (_channel,..._callbacks) {
		if (self._eventchannels[_channel] == undefined) {
			self._eventchannels[_channel] = [];
		}
		for ( let i = 0; i < _callbacks.length; i++) {
			self._eventchannels[_channel].push(_callbacks[i]);
		}
		self.log.debug(`added event listener for '${_channel}'`);
	}
	call (_channel,_data) {
		if (self._eventchannels[_channel] == undefined) {
			self._eventchannels[_channel] = [];
		}
		self.log.debug(`called event '${_channel}' ${_data != undefined ? "with data of '"+_data+"'": ""}`)
		self._eventchannels[_channel].forEach(c => c(self.diddle,_data || null));
	}
}
module.exports = EventManager;