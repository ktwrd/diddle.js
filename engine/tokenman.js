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
        this.event.on('dataReload', d => this.on_dataReload())
        this.event.on('data-reload', d => this.event.emit('dataReload'))
        this.ready()
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
        this.event.emit('dataReload');
        this.event.emit('data-reload');
    }

    /**
     * @param {String} key 
     * @returns {*}
     */
    get(key) {
        if (key == undefined) throw new Error (`Parameter 'key' is undefined`)
        return this.#data[key]
    }

    // SECTION Event Listeners
    /** @listens TokenManager.dataReload */
    on_dataReload() {
        let data = this.diddle.pacman.get('org.js.diddle.engine.config').get()
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