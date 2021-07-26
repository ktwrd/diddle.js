// secrets.json has the exact same scheme as the example below vvv
const _credentials = require("./secrets.json") || {
	discord: "<discord token here>",
	http: {
		port: "8882",
		prefix: "ugs_metrics",
	},
	prefix: "ugs_metrics",
	updaterate: 30, // 15 Seconds
}

const { POINT_CONVERSION_COMPRESSED } = require("constants");
const discord = require("discord.js");
const http = require("http");
const toolbox = require("tinytoolbox");
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

var LaunchTimestamp = Date.now()

var PrometheusResponse = {
	get header() {
return `# TYPE count counter
# TYPE uptime counter
uptime{ prefix="${_credentials.prefix}" } ${Math.round((Date.now() - LaunchTimestamp)/1000)}`;
	},
	data: "",
}

const HTTPServer = http.createServer((request,response) => {
	if (request.url.startsWith("/metrics")) {
		response.write(PrometheusResponse.header+"\n"+PrometheusResponse.data);
		response.end();
	} else {
		response.write('404');
		response.end();
	}
}).listen(_credentials.http.port, () => {
	console.log(`started prometheus metric at http://0.0.0.0:${_credentials.http.port}/metrics`);
});
/*
count{ group="" channel="" type="" } 0
count{ group="" category=""} 0
count{ group="" } 0
*/
const UpdatePrometheusResponse = (_data,_timestamp) => {
	PrometheusResponse.data = "";
	var _prefix = `prefix="${_credentials.prefix}" `
	Object.entries(_data).forEach((Group) => {
		var GroupName = Group[0];
		if (GroupName == "timestamp") return;
		PrometheusResponse.data+=`\ncount { ${_prefix}group="${GroupName}" } ${Group[1].count || 0}`

		Object.entries(Group[1]).forEach((dp)=>{
			Object.entries(dp[1]).forEach((dp_c) => {
				if (dp_c[0] == "count") return;
				PrometheusResponse.data+=`\ncount { ${_prefix}group="${GroupName}" type="${dp_c[1].type || "null"}" ${dp[0]}="${dp_c[0]}" ${dp[0]}name="${Object.entries(dp_c[1].name)[0][0].replace("\"","").replace("}","").replace("{","").replace("\\","")}" } ${dp_c[1].count}`;
			})
		})
	})
}

var MessageCache = [
	/*
	{
		"guild": 0000,
		"group": "Group",
		"channel": 0000,
		"category": 0000,
		"type": "text|voice|category"
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
			wChunk[wData[i].group].channel[wData[i].channel].type = wData[i].type;
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

	UpdatePrometheusResponse(wChunk,PushTimestamp);
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
		category: message.channel.parentID,
		type: message.channel.type,
	})
})
client.on('ready',() =>{
	console.log (`Logged in as; ${client.user.tag}`);
})
client.login(_credentials.discord)