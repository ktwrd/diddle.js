const EngineScript = require("./enginescript");

const manifest = {
	version: '0.1',
	name: 'diddle.js/tokenman'
}

class TokenManager extends EngineScript {
	constructor(diddle) {
		super(diddle,manifest);
		this.event.on('data-reload',() => {
			this._data = this.diddle.config.get().token;
		})
	}
	_ready() {
		this.event.call('data-reload');
	}

	get(name) {
		return this._data[name];
	}
}
module.exports = TokenManager