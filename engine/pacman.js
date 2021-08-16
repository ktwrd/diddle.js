const EngineScript = require("./enginescript");

const manifest = {
	name: "org.js.diddle.engine.pacman",
	version: "0.1"
}

class PackageManager extends EngineScript {
	_processPackageArray(arr) {
		for (let i = 0; i < arr.length; i++) {
			var currentscript = arr[i];
			if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(currentscript.manifest.name) && !currentscript.manifest.name.startsWith("_processPackageArray")) {
				/*let wstring = '';
				var mname = currentscript.manifest.name.split(".");
				for (let j = 0; j < mname.length; j++) {
					var wname = mname[j]
					wstring+="."+wname;

					eval(`this${wstring} = this${wstring} || {};`);
				}
				eval("this."+currentscript.manifest.name+" = currentscript");*/
				this._data[currentscript.manifest.name] = currentscript;
				if (currentscript._ready != undefined) {
					currentscript._ready();
				}
			}
		}
	}
	get(PackageName) {
		return this._data[PackageName];
	}
	constructor(diddle) {
		super(diddle,manifest);
		this._data = {};
	}
}
module.exports = PackageManager;