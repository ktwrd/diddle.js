module.exports = {
	event: {},
	manifest: {
		author: 'Jyles Coad-Ward <jyles@dariox.club>',
		license: 'MIT',
		source: 'https://example.com/ping.js'
	}
}
module.exports.event.onload = (diddle) => {
	// Executed when script is initally processed in diddle.js/loader
}
module.exports.event.test = 60;
module.exports.event["discord-message"] = (message,diddle) => {
	switch(message.command) {
		case "ping":
			var m = message.channel.send("Calculating Ping");
			m.edit("Pong! (`" + Date.now() - m.createdTimestamp + "ms`)");
			break;
		case "version":
			message.channel.send(`Running ${diddle.manifest.name}@${diddle.manifest.version}`);
			break;
	}
}