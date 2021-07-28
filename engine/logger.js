/**
 * @class Logger
 * @arg {DiddleEngine} diddle
 * @arg {string} prefix Log Prefix. Defaults to <code>diddle.js</code>
 */
class Logger {
	constructor(diddle,prefix) { 
		this.diddle = diddle; 
		this.prefix = prefix || "diddle.js";
	}

	color = {
		Reset: "\x1b[0m",
		Bright: "\x1b[1m",
		Dim: "\x1b[2m",
		Underscore: "\x1b[4m",
		Blink: "\x1b[5m",
		Reverse: "\x1b[7m",
		Hidden: "\x1b[8m",

		FgBlack: "\x1b[30m",
		FgRed: "\x1b[31m",
		FgGreen: "\x1b[32m",
		FgYellow: "\x1b[33m",
		FgBlue: "\x1b[34m",
		FgMagenta: "\x1b[35m",
		FgCyan: "\x1b[36m",
		FgWhite: "\x1b[37m",

		BgBlack: "\x1b[40m",
		BgRed: "\x1b[41m",
		BgGreen: "\x1b[42m",
		BgYellow: "\x1b[43m",
		BgBlue: "\x1b[44m",
		BgMagenta: "\x1b[45m",
		BgCyan: "\x1b[46m",
		BgWhite: "\x1b[47m",
	}

	/**
	 * Will only print if debug mode is enabled.
	 * @param  {...any} c Content to print
	 */
	debug(...c) {
		if (!this.diddle.debug) return;
		console.log(`${this.color.BgBlack}${this.color.FgMagenta}${this.prefix}:${this.color.Reset} ${c.join(' ')}`);
	}
	/**
	 * @param  {...any} c Content to Print
	 */
	info(...c) {
		console.log(`${this.color.BgBlack}${this.color.FgBlue}${this.prefix}:${this.color.Reset} ${c.join(' ')}`);
	}
	/**
	 * @param  {...any} c Content to Print
	 */
	warn(...c) {
		console.log(`${this.color.BgBlack}${this.color.FgYellow}${this.prefix}:${this.color.Reset} ${c.join(' ')}`);
	}
	/**
	 * @param  {...any} c Content to Print
	 */
	error(...c) {
		console.log(`${this.color.BgBlack}${this.color.FgRed}${this.prefix}:${this.color.Reset} ${c.join(' ')}`);
	}
}
module.exports = Logger;