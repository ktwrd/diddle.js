const Logger = require("./logger");
const EventEmitter = require('events')

const manifest = {
    version: '0.1b',
    name: 'org.js.diddle.engine.event'
}

/**
 * @class
 * @extends node:events
 */
class EventManager extends EventEmitter {
    /**
     * @type {Logger}
     * @default null
     * @private
     */
    #logger = null;

    /**
     * @type {DiddleEngine}
     * @default null
     */
    diddle = null;

    /**
     * @param {DiddleEngine} diddle 
     */
    constructor(diddle) {
        super();
        this.diddle = diddle;
        this.#logger = new Logger(diddle, manifest.name);

        this.on('newListener', this.#onNewListener)
        this.on('removeListener', this.#onRemoveListener)
        this.on('debug', this.#logger.debug)
        this.on('error', this.#logger.error)
        this.on('warn', this.#logger.warn)
        this.on('destroy', () => {
            setTimeout(() => {
                this.removeAllListeners()
            }, 150)
        })
    }

    /**
     * @listens EventManager.newListener
     * @param {String|Symbol} eventName 
     * @param {Function} listener 
     */
    #onNewListener(eventName, listener) {
        this.#logger.debug(`newListener    -> ${eventName}`)
    }
    /**
     * @listens EventManager.removeListener
     * @param {String|Symbol} eventName 
     * @param {Function} listener 
     */
    #onRemoveListener(eventName, listener) {
        this.#logger.debug(`removeListener -> ${eventName}`)
    }

    /**
     * @alias node:events.call
     */
    get call() {
        return this.emit;
    }

    /**
     * @event EventManager.newListener
     * @see https://nodejs.org/api/events.html#event-newlistener
     * @param {String|Symbol} eventName
     * @param {Function} listener
     */
    /**
     * @event EventManager.removeListener
     * @see https://nodejs.org/api/events.html#event-removelistener
     * @param {String|Symbol} eventName
     * @param {Function} listener
     */
}
module.exports = EventManager;