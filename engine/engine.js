const ScriptManager = require("./scriptman.js");
const LogUtil = require("./logger.js")
const LocaleManager = require("./locale.js");
const ConfigurationManager = require("./configman.js");
const EventManager = require("./eventman");
const DiscordWrapper = require("./discord");
const EngineExtensionManager = require("./extensionmanager.js");

const path = require("path");
const StorageManager = require("./store.js");
const TokenManager = require("./tokenman.js");
const PackageManager = require("./pacman.js");
/**
 * @projectname diddle.js
 * @version 0.3.0
 */

/**
 * @class
 * @summary
 * diddle.js Engine
 */
class DiddleEngine {
    /**
     * @type {EngineScript.manifest}
     */
    manifest = {
        version: require("./../package.json").version,
        name: 'org.js.diddle.engine',
        requires: [
            'org.js.diddle.engine.loader',
            'org.js.diddle.engine.script',
            'org.js.diddle.engine.config',
            'org.js.diddle.engine.locale',
            'org.js.diddle.engine.event',
            'org.js.diddle.engine.discord',
            'org.js.diddle.engine.extension',
            'org.js.diddle.engine.store',
            'org.js.diddle.engine.token'
        ]
    }

    /**
     * @type {String}
     * @summary
     * Base directory of where {@link DiddleEngine} was ran from.
     */
    directory = path.resolve("./");

    /**
     * @type {Number}
     * @summary
     * Unix Epoch in Milliseconds (from `Date.now()`)
     */
    startTimestamp = Date.now()

    /**
     * @type {Object<String, Array.<Function>>}
     */
    _eventchannels = {
        /*
        <channel>: function[]
        */
    };


    /**
     * @async
     * @param {Object|Array} obj 
     * @returns {Boolean}
     */
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

    /** @private */
    _wrapperPopulate() {
        this.locale = new LocaleManager(this);
        this.pacman._processPackageArray([
            new ConfigurationManager(this,this._config),
        ])
        this.pacman._processPackageArray([
            new TokenManager(this),
            new StorageManager(this),
        ])
        this.pacman._processPackageArray([
            new EngineExtensionManager(this),
        ])
        this.pacman._processPackageArray(this.pacman.get("org.js.diddle.engine.extension").extensions);
        this.pacman._processPackageArray([
            new DiscordWrapper(this),
            new ScriptManager(this),
        ])
    }

    /**
     * @param {ConfigurationManager.config} diddleconfig User configuration, gets merged with <code>engine/diddle.config.default.json</code> to make sure that the required values are populated.
     * @param {bool} debug Whether to enable debug logging
     */
    constructor(diddleconfig,debug) {
        this.debug = debug;
        if (!this._isJSON(diddleconfig)) {
            throw new Error("Configuration is not JSON");
        }
        this.event = new EventManager(this);
        this.log = new LogUtil(this,this.manifest.name);

        this._config = diddleconfig;

        this.log = new LogUtil(this,this.manifest.name);
        this.log.info(`Running ${this.manifest.name}@${this.manifest.version} ${this.debug ? '(Debug Mode Enabled)' : ''}`);

        this.pacman = new PackageManager(this);

        this._wrapperPopulate();
    }

    /**
     * @type {PackageManager}
     * @default null
     */
    pacman = null;
}

module.exports = {
    engine: DiddleEngine,
    ScriptManager: require("./scriptman.js"),
    Logger: require("./logger"),
    LocaleManager: require("./locale"),
    Configuration: require("./configman"),
    EventManager: require("./eventman"),
    EngineScript: require("./enginescript"),
    Discord: require("./discord"),
    ExtensionManager: require("./extensionmanager"),
    Extension: require("./extensionscript")
}