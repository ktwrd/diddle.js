// secrets.json has the exact same scheme as the example below vvv
const _credentials = require("./secrets.json") || {
	discord: "<discord token here>",
	graphite: {
		protocol: 'plaintext',
		address: "127.0.0.1",
		port: "2003",
		prefix: "ugs_metrics",
	},
	updaterate: 15, // 15 Seconds
}

const discord = require("discord.js");
const graphite = require("graphite");
const toolbox = require("tinytoolbox");
const graphiteClient = graphite.createClient(`${_credentials.graphite.protocol}://${_credentials.graphite.address}:${_credentials.graphite.port}/`);
const client = new discord.Client();

var GroupAssociation = {
	"Creative": [
		'861144043826970625', // Artist
	],
	"Writer": [
		'861025904980131841', // Community Member
		'864911723151360001', // Lore
		'864911762405851198', // Script
		'864911774511661056', // Story
	],
	"Music": [
		'861966360875237406', // Music Team Member
		'863429301428813825', // Music and Audio Community Member
	],
	"VA": [
		'863428860723724349', // VA Community Member
	],
	"GDev": [
		'863428783981068298', // Community Member
		'861286073756811294', // Core Dev Team
		'868807785914204171',
	],
	"GDesign": [
		'863429226873880586', // Community Member
		'861017415671218188', // Game Designing
		'862361548226822164', // Game Design
	],
	"Misc": [
		'864911754583474217', // World-Builders
		'864911769851527259', // Research
		'863429155009855520', // Marketing
		'860775491320545291', // Play Tester
		'868807815735689246',
	]
}

var MessageCache = [
	/*
	{
		"guild": 0000,
		"group": "Group",
		"channel": 0000,
		"category": 0000,
	}
	*/
];

var ProcessMessages = () => {
	var PushTimestamp = Date.now();
	var wData = MessageCache;
	MessageCache = [];

	var wChunk = {
		timestamp: Date.now()
	};

	for (let i = 0; i < wData.length; i++) {
		if (wChunk[wData[i].group] == undefined) {
			wChunk[wData[i].group] = {
				channel: { },
				category: { },
				count: 0,
			}
		}

		var guild = client.guilds.cache.get(wData[i].guild);

		if (wChunk[wData[i].group].channel[wData[i].channel] == undefined) {
			wChunk[wData[i].group].channel[wData[i].channel] = {};
			wChunk[wData[i].group].channel[wData[i].channel].count = 0;
			wChunk[wData[i].group].channel[wData[i].channel].name = JSON.parse(`{"${guild.channels.cache.get(wData[i].channel).name}":1}`)
		}

		if (wChunk[wData[i].group].category[wData[i].category] == undefined && wData[i].category != null) {
			wChunk[wData[i].group].category[wData[i].category] = {};
			wChunk[wData[i].group].category[wData[i].category].count = 0;
			wChunk[wData[i].group].category[wData[i].category].name = JSON.parse(`{"${guild.channels.cache.get(wData[i].category).name}":1}`)
		}

		// Increment message for that channel/category under that group
		wChunk[wData[i].group].channel[wData[i].channel].count++
		if (wData[i].category != null) {
			wChunk[wData[i].group].category[wData[i].category].count++;
		}
		wChunk[wData[i].group].count++;
	}

	// The only way I could think of at the time to include the graphite prefix
	var writeData = JSON.parse(`{ "${_credentials.graphite.prefix}": ${JSON.stringify(wChunk)} }`)

	graphiteClient.write(writeData,PushTimestamp,(e) => {
		// Ignore if null (from the api documentation)
		if (e == null) {
			console.log(writeData)
		}
		if (e == null) return;
		console.error(e);
		console.error(writeData);
	})
}

var PushInterval = setInterval(ProcessMessages,_credentials.updaterate*1000);

client.on('message',async (message) => {
	// Groups that the user is in.
	var Groups = [];

	await toolbox.async.forEach(Object.entries(GroupAssociation),(group) => {
		var HasRole = false;
		for (let i = 0; i < group[1].length; i++) {
			if (message.member.roles.cache.has(group[1][i])) {
				HasRole = true;
			}
		}
		if (HasRole) {
			Groups.push(group[0]);
		}
	})

	if (Groups.length < 1) return;
	MessageCache.push({
		guild: message.guild.id,
		channel: message.channel.id,
		group: Groups.join("_"),
		category: message.channel.parentID
	})
})
client.on('ready',() =>{
	console.log (`Logged in as; ${client.user.tag}`);
})
client.login(_credentials.discord)