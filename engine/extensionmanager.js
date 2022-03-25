const EngineScript = require("./enginescript.js");
const ExtensionScript = require("./extensionscript.js");
const path = require("path")
const fs = require("fs")

const manifest = {
    name: "org.js.diddle.engine.extension",
    version: "0.1"
}

function isClass(v) {
    return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}

/**
 * @class
 * @extends EngineScript
 */
class EngineExtensionManager extends EngineScript {
    /**
     * @type {String}
     * @summary
     * The absolute directory where all of the custom Engine Extensions live.
     */
    cwd = '';

    /**
     * @param {DiddleEngine} diddle 
     */
    constructor(diddle) {
        super(diddle, manifest);
        this.cwd = '';
    }

    _ready() {
        this._fetchExtensions();
    }

    /** @type {Object<string, ExtensionScript>} */
    _store = {
        /*
        <ScriptUID>: ExtensionScript
        */
    }

    /**
     * @description Add Custom Engine Extension
     * @param {ExtensionScript} extension 
     */
    append(extension) {
        this._store[extension._ScriptUID] = extension;
    }

    /**
     * @description Fetch Extension by its Unique Identifier
     * @param {String} ScriptUID 
     * @returns {ExtensionScript}
     */
    getByUID(ScriptUID) {
        if (this._store[ScriptUID] == undefined) throw new Error(this.diddle.locale.get("ScriptExt.FetchFail.ExtensionNotFound"))
        return this._store[ScriptUID];
    }

    /**
     * @description Returns an Array of all Extensions that match the given name.
     * @param {String} ScriptName 
     * @returns {ExtensionScript[]}
     */
    getByName(ScriptName) {
        return Object.entries(this._store).filter(script => script[1].manifest.name == ScriptName);
    }

    _fetchExtensions() {
        var config = this.diddle.pacman.get("org.js.diddle.engine.config").get();

        var timestamp_start = Date.now();

        this.log.info(`fetching extensions...`);

        this.cwd = path.resolve(config.extensions);

        if (!fs.existsSync(this.cwd)) {
            try {
                fs.mkdirSync(this.cwd)
            } catch(e) {
                this.log.error(`cannot create extensions directory\n`,e);
                process.exit(1);
            }
            this.log.info(`created extensions directory`);
        }

        
        // Get Script Files
        var ext_filenames,ext_filtered = [];

        try {
            ext_filenames = fs.readdirSync(this.cwd).filter(f => f.endsWith(".js"));
        } catch(e) {
            this.log.error(`cannot fetch extensions directory\n`,e);
            process.exit(1);
        }

        for (let i = 0; i < ext_filenames.length; i++) {
            let current_filename = ext_filenames[i];
            let current = require(path.join(this.cwd,current_filename));

            if (isClass(current)) {
                var ext = new current(this.diddle);
                if (ext.manifest.name)
                ext_filtered.push(ext);
                this.log.debug(`loaded extension ${ext.manifest.name}@${ext.manifest.version} (${ext._ScriptUID})`)
            } else {
                this.log.error(`extension '${path.join(this.cwd,current_filename)}' cannot be constructed (isn't a class)`);
                return;
            }
        }

        this.extensions = ext_filtered;

        this.log.info(`took ${Date.now() - timestamp_start}ms`);
    }
}
module.exports = EngineExtensionManager;