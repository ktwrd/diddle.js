const EngineScript = require("./enginescript");

const manifest = {
    version: '0.1',
    name: 'org.js.diddle.engine.token'
}
/**
 * @class
 * @extends {EngineScript}
 */
class TokenManager extends EngineScript {
    /**
     * @param {DiddleEngine} diddle 
     */
    constructor(diddle) {
        super(diddle, manifest);
        this.event.on('dataReload', this.on_dataReload)
    }

    /**
     * @type {Object}
     * @private
     */
    #data = {}
    /**
     * @type {Object}
     * @readonly
     */
    get data() { return this.#data }
    set data(value) {}

    /**
     * @emits TokenManager.dataReload
     */
    ready() {
        this.event.call('data-reload');
    }

    /**
     * @param {String} key 
     * @returns {*}
     */
    get(key) {
        if (key == undefined) throw new Error (`Parameter 'key' is undefined`)
        return this._data[key]
    }

    // SECTION Event Listeners
    /** @listens TokenManager.dataReload */
    on_dataReload() {
        let data = this.diddle.pacman.get('org.js.diddle.engine.config').get()
        if (data.token == undefined || typeof data.token != 'object')
            data.token = {}
        this.#data = data.token
    }
    // !SECTION

    // SECTION Event Documentation
    /**
     * @event TokenManager.dataReload
     */
    // !SECTION
}
module.exports = TokenManager