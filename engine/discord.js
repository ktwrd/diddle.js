const discord = require("discord.js");
const DiscordEvents = require("./discord-events.json");
const EngineScript = require("./enginescript");

const manifest = {
	version: '0.2',
	name: 'org.js.diddle.engine.discord'
}


/**
 * @class DiscordWrapper
 * @property {module:discord.js/Client} client <a href="https://discord.js.org/#/docs/main/stable/class/Client">Discord.JS Client</a>
 * @param {DiddleEngine} diddle 
 * @extends {EngineScript}
 */
class DiscordWrapper extends EngineScript{
	/**
	 * @memberof DiscordWrapper
	 * @description Gets called when DiscordWrapper needs to be ready for other scripts to use.
	 */
	async _ready() {
		this.cmd_prefix = this.diddle.pacman.get("org.js.diddle.engine.config").get().discord.prefix;
		for ( let i = 0; i < DiscordEvents.length; i++ ) {
			switch(DiscordEvents[i]) {
				case "message":
					this.client.on(DiscordEvents[i],(d) => {
						var msg = this.msg(d);
						this.event.call(`discord-${DiscordEvents[i]}`,msg)
					});
					break;
				default:
					this.client.on(DiscordEvents[i],d => this.event.call(`discord-${DiscordEvents[i]}`,d));
					break;
			}
		}
		this.log.info("connecting to discord");
		var token = this.diddle.pacman.get("org.js.diddle.engine.token").get("discord");
		try {
			await this.client.login(token);
		} catch(e) {
			this.log.error("failed to connect to discord;\n",e);
			return;
		}
		this.log.info("connected to discord as "+this.client.user.tag);
	}
	
	/** @function
	 * @name msg
	 * @arg {module:discordjs.GuildMessage} _message Discord Message to Inject the Command, Prefix, and Arguments into.
	 * @private
	 */
	msg(_message) {
		_message.prefix = this.diddle.pacman.get("org.js.diddle.engine.config").get().discord.prefix;
		_message.command = _message.content.replace(_message.prefix,"").split(' ')[0];
		_message.args = _message.content.split(_message.prefix+_message.command).join('').split(' ');
		_message.command = _message.command.toLowerCase().trim();
		return _message;
	}

	constructor(diddle) {
		super(diddle,manifest);
		this.client = new discord.Client();
		this.log.info(`Running ${this.manifest.name}@${this.manifest.version}`);
	}
	
}
module.exports = DiscordWrapper;