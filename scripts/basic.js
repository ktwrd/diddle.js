module.exports = {
	event: {},
	manifest: {
		author: 'Jyles Coad-Ward <jyles@dariox.club>',
		license: 'MIT',
		source: 'https://example.com/ping.js',
		type: 'event'
	}
}
module.exports.event.onload = (diddle) => {
	// Executed when script is initally processed in diddle.js/loader
}
module.exports.event["discord-message"] = (diddle,message) => {
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