const EventManager = require("./eventman")
const discord = require("discord.js");
const Logger = require("./logger");
const DiscordEvents = require("./discord-events.json");

class DiscordWrapper {
	manifest = {
		version: '0.1b',
		name: 'diddle.js/discord'
	}
	log = new Logger(this.diddle,this.manifest.name);
	client = new discord.Client();

	async _ready() {
		this.log.info("connecting to discord");
		try {
			await this.client.login(this.diddle.config.get().discord.token);
		} catch(e) {
			this.log.error("failed to connect to discord;\n",e);
			return;
		}
		this.log.info("connected to discord as "+this.client.user.tag);
	}
	
	constructor(diddle) {
		this.diddle = diddle;
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
		this.event = new EventManager(this.diddle);
		for ( let i = 0; i < DiscordEvents.length; i++ ) {
			this.client.on(DiscordEvents[i],d => this.event.call(`discord-${DiscordEvents[i]}`,d));
		}
	}
	
}
module.exports = DiscordWrapper;