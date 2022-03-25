const EngineScript = require("./enginescript");
const fs = require("fs");
const path = require("path")
const toolbox = require("tinytoolbox")

const manifest = {
    name: 'org.js.diddle.engine.store',
    version: '0.1'
};

/**
 * @class
 */
class StorageObject {
    /**
     * @type {Boolean}
     * @default false
     * @summary
     * If true there are pending changes to sync.
     */
    hasUpdated = false;

    /**
     * @type {Object}
     * @property {Object} meta
     * @property {String} meta.name
     * @property {String} meta.id
     * @property {*} content=null
     */
    _data = {
        meta: {
            name: '',
            id: '',
        },
        content: null
    }

    /**
     * @type {String}
     * @default null
     * @summary
     * Filename of the storage object. Always ends with `.json`.
     */
    filename = null;

    /**
     * @type {String}
     * @default null
     * @summary
     * Directory where {@link StorageObject.filename} exists in.
     */
    directory = null;

    /**
     * @type {String}
     * @default null
     * @summary
     * If {@link StorageObject.filename} and {@link StorageObject.directory} is not `null`,
     * then the combined {@link StorageObject.directory|directory} and {@link StorageObject.filename|filename} is returned.
     */
    get location() {
        if (this.directory != null && this.filename != null) {
            if (!fs.existsSync(this.directory)) {
                try {
                    fs.mkdirSync(this.directory, {recursive: true})
                } catch(e) {
                    return null
                }
            }
            return path.join(this.directory, this.filename)
        }
        return null
    }
    location = null;

    /**
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
     * @summary
     * Sync data from the StorageObject to the File if there are changes or sync the File to this StorageObject if there are no pending changes.
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

    /**
     * @summary
     * Reset the storage objects Unique Identifier
     */
    resetID() {
        this._data.meta.id = toolbox.stringGen(16,3);
        this.hasUpdated = true;
    }

    /**
     * @returns {StorageObject.data.content}
     */
    get() {
        return this._data.content;
    }

    /**
     * @param {*} data - Data to replace the contents of {@link StorageObject.data.content} with.
     * @returns {StorageObject.data.content}
     */
    set(data) {
        this.hasUpdated = true;
        this._data.content = data;
        return this._data.content;
    }
}

/**
 * @class
 * @extends EngineScript
 */
class StorageManager extends EngineScript {
    /**
     * @param {DiddleEngine} diddle 
     */
    constructor(diddle) {
        super(diddle,manifest);
    }

    _ready() {
        this.directory = path.resolve(this.diddle.pacman.get("org.js.diddle.engine.config").get().data);

        if (!fs.existsSync(this.directory)) {
            try {
                fs.mkdirSync(this.directory);
            } catch (e) {
                this.log.error(`failed to create data directory;\n${e.stack}`);
                process.exit(1);
            }
            this.log.debug(`created data directory`);
        }

        var files = fs.readdirSync(this.directory);

        for (let i = 0; i < files.length; i++) {
            var fname = files[i];
            switch (fname.startsWith) {
                case "js":
                case "json":
                    this._cache.push(new StorageObject(fname,this.directory));
                    break;
            }
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

    /**
     * @description Returns all storage objects with the matching meta name
     * @param {string} StorageName 
     * @returns {StorageObject[]}
     */
    getByName(StorageName) {
        return this._cache.filter(s => s._data.meta.name == StorageName);
    }

    /**
     * @description Fetch all Storage Objects matching the filename.
     * @param {string} fname Filename
     * @returns {StorageObject[]}
     */
    getByFilename(fname) {
        return this._cache.filter(s => s.filename == fname);
    }

    /**
     * @param {String} _name - Target Filename
     * @returns {StorageObject}
     */
    create(_name) {
        let so = new StorageObject(`${_name}.json`,this.directory);
        this._cache.push(so);
        return so;
    }
}
module.exports = StorageManager;