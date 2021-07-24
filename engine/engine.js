class diddle {

	_isJSON(obj) {
		return new Promise((res) => {
			try {
				let t = JSON.stringify(obj);
			} catch(e) {
				res(false);
			}
			res(true);
		})
	}

	dlog(...d) {
		if (this.debug) {
			console.log(d.join(' '));
		}
	}

	constructor(diddleconfig) {
		if (!this._isJSON(diddleconfig)) {
			throw new Error("Configuration is not JSON");
		}

		this.debug = diddleconfig.debug != undefined && diddleconfig.debug == true;
		dlog("Hello World!");
	}
}
module.exports = diddle;