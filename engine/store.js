const EngineScript = require("./enginescript");
const fs = require("fs");
const path = require("path")
const toolbox = require("tinytoolbox")

const manifest = {
	name: 'diddle.js/store',
	version: '0.1'
};

/**
 * @property {string} filename The filename for the object currently accessing
 * @property {string} directory Directory where the file exists
 * @property {string} location Absolute file location
 * @property {bool} hasUpdated If true there are pending changes to sync.
 */
class StorageObject {
	hasUpdated = false;

	/**
	 * 
	 * @param {string} _filename A Valid JSON Filename
	 * @param {string} _directory A Valid Directory
	 */
	constructor(_filename,_directory) {
		this.filename = _filename;
		this.directory = _directory;
		this.location = path.join(_directory,_filename);

		if (!fs.existsSync(_directory)) {
			fs.mkdirSync(_directory,{recursive:true});
		}

		this.sync()
		if (this._data.meta.id.length < 1) {
			this.resetID();
		}
		this.sync()

	}

	/**
	 * @description Sync data from the StorageObject to the File if there are changes or sync the File to this StorageObject if there are no pending changes.
	 */
	sync() {
		try {
			if (!fs.existsSync(this.location)) {
				fs.writeFileSync(this.location,JSON.stringify(this._data,null,'\t'));
			}
			if (this.hasUpdated) {
				fs.writeFileSync(this.location,JSON.stringify(this._data,null,'\t'))
			} else {
				this._data = require(this.location);
			}
			this.hasUpdated = false;
		} catch(error) {
			console.error(`\x1b[41m====== [FATAL STORAGE ERROR] ======\x1b[0m\n${this.location}\n`,error,`\n\x1b[41m====== ##################### ======\x1b[0m`)
			return error;
		}
	}

	_data = {
		meta: {
			name: '',
			id: '',
		},
		content: null
	}

	/**
	 * @description Reset the storage objects Unique Identifier
	 */
	resetID() {
		this._data.meta.id = toolbox.stringGen(16,3);
		this.hasUpdated = true;
	}
	/**
	 * 
	 * @returns {*} Data stored in <code>_data.meta.content</code>
	 */
	get() {
		return this._data.content;
	}
	/**
	 * 
	 * @param {*} data Set this StorageObjects content
	 * @returns {*} <code>_data.meta.content</code>
	 */
	set(data) {
		this.hasUpdated = true;
		this._data.content = data;
		return this._data.content;
	}
}

class StorageManager extends EngineScript {
	/**
	 * 
	 * @param {DiddleEngine} diddle 
	 */
	constructor(diddle) {
		super(diddle,manifest);
	}

	_ready() {
		this.directory = path.resolve(this.diddle.config.get().data);

		if (!fs.existsSync(this.directory)) {
			try {
				fs.mkdirSync(this.directory);
			} catch (e) {
				this.log.error(`failed to create data directory;\n${e.toString()}`);
				process.exit(1);
			}
			this.log.debug(`created data directory`);
		}

		var files = fs.readdirSync(this.directory);

		for (let i = 0; i < files.length; i++) {
			var fname = files[i];
			this._cache.push(new StorageObject(fname,this.directory));
			console.log(fname)
		}
	}

	/** @type {StorageObject[]} */
	_cache = []

	/**
	 * @description Fetch storage object with matching ID
	 * @param {string} StorageID Get storage object with the matching Storage ID. When undefined <code>StorageObject._cache</code> is returned
	 * @returns {StorageObject}
	 * @returns {StorageObject[]} Only when no parameters are passed
	 */
	get(StorageID) {
		if (StorageID == undefined) return this._cache;
		var res = this._cache.filter(s => s._data.meta.id == StorageID);
		return res[0]
	}

	create(_name) {
		let so = new StorageObject(`${_name}.json`,this.directory);
		this._cache.push(so);
		return so;
	}
}
module.exports = StorageManager;