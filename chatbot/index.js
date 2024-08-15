function salt(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

// settings
var host = "dexland.su";
var botname = salt(15);
var password = "d3ll_changeme";
var lbot;

// tasks
var delay = 5000;
var cancel = false;


// Функция для задержек в асинхронных функциях
const timerp = ms => new Promise(res => setTimeout(res, ms));
var cooldown = 0; // Временный счётчик для приглашений в лс, чтобы не кикало за спам

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function send(command) {
	if (!lbot) return console.log("============= Bot tried to send a message, but is not connected!");
	if (command.length > 255) {
		console.log("============= Bot tried to send too long message");
		return
	}
	if (command.indexOf("§") != -1 || command.indexOf("\n") != -1 || command.indexOf("\r") != -1) {
		console.log("============= Bot tried to send invalid symbols");
		return
	}
	lbot.chat(command);
}

function exit() {
	if (!lbot) return console.log("============= Bot is not connected");
	lbot.quit();
	lbot = undefined;
	console.log(`============= Left (user input)`);
}

// Время для логирования
function time() {
	var date = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	var time = `[${date}] `;
	return time;
}


const mineflayer = require('mineflayer');

function createIns() {
	const bot = mineflayer.createBot({
		plugins: {
			bossbar: false,
			conversions: false,
			loader: false,
			location: false,
			math: false,
			painting: false,
			anvil: false,
			bed: false,
			scoreboard: false,
			block_actions: false,
			blocks: false,
			book: false,
			boss_bar: false,
			breath: false,
			chest: false,
			command_block: false,
			craft: false,
			creative: false,
			digging: false,
			enchantment_table: false,
			experience: false,
			explosion: false,
			fishing: false,
			furnace: false,
			generic_place: false,
			particle: false,
			physics: false,
			place_block: false,
			place_entity: false,
			rain: false,
			ray_trace: false,
			resource_pack: false,
			scoreboard: false,
			spawn_point: false,
			tablist: false,
			team: false,
			time: false,
			title: false,
			villager: false,
			entities: false // bypasses dexland security
		},
		host: host,
		username: botname,
		port: "25565",
		version: "1.18.2"
	});

	bot.on("login", () => {
		console.log("============= Bot joined.");
	});
	bot.on("spawn", () => {
		console.log("============= Bot spawned. Use /surv-X to connect.");
	});
	bot.on("respawn", () => {
		console.log("============= Bot respawned (changed dimensions or died)");
	});

	bot.on("message", (message, messagePosition) => {
		if (messagePosition == "chat") console.log(`[2;36m${time()}${message.toAnsi()}`);
	});

	bot.on("messagestr", (message) => {
		if (message.includes("/reg ")) {
			send(`/reg ${password}`);
			console.log("============= Sent /register request");
		}

		else if (message.includes("/login ")) {
			send(`/login ${password}`);
			console.log("============= Sent /login request");
		}

		else if (message === "◊ Вы превысили лимит регистраций с вашего IP") {
			console.log("============= Cannot register! Too many accounts from an IP.");
		}
	});

	// Log errors and kick reasons:
	bot.on('kicked', console.log);
	bot.on('error', console.log);

	lbot = bot;
}


// addons //
const sctx = {
	getInstance: () => {
		return lbot;
	},

	chat: send,

	setUser: (user) => {
		if (typeof user != "string") return;
		if (user.length > 18) return;

		botname = user;
	},
	getUser: () => {
		return botname;
	},
	setHost: (nhost) => {
		if (typeof nhost != "string") return;
		if (nhost.indexOf(".") == -1) return;

		host = nhost;
	},
	getHost: () => {
		return host;
	},
}

const fs = require("fs");
const path = require("path");
const addons = {};

const handleFile = (path) => {
	const imported = require(path);
	imported.load(sctx);
	addons[imported.name] = imported;
	console.log(`Loaded addon "${imported.name}".`);
};

const requireAllFilesInDirectory = (directory) => {
	fs.readdirSync(directory).forEach((file) => {
		const fullPath = path.join(directory, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			requireAllFilesInDirectory(fullPath);
		} else if (stat.isFile() && file.endsWith(".js")) {
			handleFile(fullPath);
		}
	});
};

requireAllFilesInDirectory(path.join(__dirname, "addons"));
console.log("Finished loading", Object.keys(addons).length, "addons!\n")
// //


const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log(`[2;96mCommands:
[2;94m- @list

[2;94m- @exit / @quit / @leave
[2;94m- @restart

[2;94m- @info
[2;94m- @sethost
[2;94m- @setname

[2;94m- @login[0m
`)

var readlinecmds = {
	"list": function() {
		if (!lbot) return console.log("============= Bot is not connected");
		let players = Object.values(lbot.players); // Получение списка игроков
		let playersArray = players.map(element => element.username); // Конвертирование в массив
		
		var maxlength = 3;
		for (i of playersArray) {
			if (maxlength < i.length) {
				maxlength = i.length;
			}
		}

		let str = playersArray.map((s, i) => {
			return s.padEnd(maxlength) + (i % 3 == 2 ? "\n" : " | ");
		}).join("").replaceAll(botname, "[1;32m" + botname + "[0m");
		console.log(`\n[1;2m >  Player List[0m\n[1;2m >  Total: ${playersArray.length}[0m\n\n${str}`);
	},

	"exit": exit,
	"quit": exit,
	"leave": exit,

	"restart": function() {
		if (lbot) lbot.quit();
		rl.close();
		process.exit();
	},

	"info": function() {
		console.log(`============= Server: [1;2m${host}[0m`);
		console.log(`============= Username: [1;2m${botname}[0m`);
		console.log(`============= Password: [1;2m<hidden: @showpass>[0m`);
	},

	"sethost": function(input) {
		host = input[0];
		readlinecmds.info();
	},
	"setname": function(input) {
		botname = input[0];
		readlinecmds.info();
	},
	"setpass": function(input) {
		password = input[0];
		readlinecmds.info();
	},
	"showpass": function() {
		console.log(`============= Password: [1;2m${password}[0m`);
	},

	"login": function() {
		if (lbot) return console.log("============= Bot is already connected");
		createIns();
	},

	// addons
	"addons": function() {
		console.log("Addons list:", Object.keys(addons).join(", "));
	}
}

for (addon of Object.values(addons)) {
	if (addon.commands) {
		for (cmd of Object.keys(addon.commands)) {
			readlinecmds[cmd] = addon.commands[cmd];
		}
	}
}

rl.on("line", (input) => {
	if (input.startsWith("@")) {
		const components = input.split(" ");

		const command = components[0].replace("@", "");
		const inputs = components.splice(1);

		if (readlinecmds[command]) {
			readlinecmds[command](inputs);
		} else {
			console.log("============= Command not found.");
		}
	} else {
		if (!lbot) return console.log("============= Bot is not connected");
		send(input);
	}
});