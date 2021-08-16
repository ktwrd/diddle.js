const EngineScript = require("./enginescript");

const manifest = {
	version: '0.1',
	name: 'org.js.diddle.engine.token'
}

class TokenManager extends EngineScript {
	constructor(diddle) {
		super(diddle,manifest);
		this.event.on('data-reload',() => {
			console.log(this.diddle.get("org.js.diddle.engine.config"))
			this._data = this.diddle.get("org.js.diddle.engine.config").get().token;
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