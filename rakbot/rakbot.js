function salt(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// settings
var host = "mc.masedworld.net";
var botname = salt(15);
var lbot;

// tasks
var delay = 5000;
var cancel = false;


// Функция для задержек в асинхронных функциях
const timerp = ms => new Promise(res => setTimeout(res, ms));

// Время для логирования
function time() {
	var date = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	var time = `[${date}] `;
	return time;
}


const mineflayer = require('mineflayer')

function createIns(r) {
	if (r) {
		let text = JSON.parse(r).text

		if (text === "§сИгрок с таким ником уже онлайн") {
			console.log(`[1;91m=[ ! ]=[1;97m  Player is online, reconnecting... ${time()}[0m`)
		} else if (text === "Вы не успели авторизироваться") {
			console.log(`[1;91m=[ ! ]=[1;97m  Expired auth time, reconnecting... ${time()}[0m`)
		} else if (text === "Вас кикнули ботом") {
			console.log(`[1;91m=[ ! ]=[1;97m  Account got kicked with 2fa, reconnecting... ${time()}[0m`)
		} else if (text === "Вас забанили ботом") {
			console.log(`[1;91m=[ ! ]=[1;97m  Account is banned with 2fa, reconnecting... ${time()}[0m`)
		} else if (text === "") {
			console.log(`[1;91m=[ ! ]=[1;97m  Connection reset, reconnecting... ${time()}[0m`)
		} else if (text === "Ваш IP адрес заблокирован на 10 минут\nВ целях безопасности аккаунта.") {
			console.log(`[1;91m=[ ! ]=[1;97m  Bot got IP banned, reconnecting... ${time()}[0m`)
		} else {
			console.log(`[1;91m=[ ! ]=[1;97m  Got kicked, text: "${JSON.parse(r).text}", reconnecting... ${time()}[0m`)
		}
	}
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
		},
		host: host,
		username: botname,
		port: "25565",
		version: "1.18.2"
	})

	bot.on("login", () => {
		console.log(`[1;32m=[ ? ]=[1;97m  Bot joined. ${time()}[0m`)
	});
	bot.on("spawn", () => {
		console.log(`[1;32m=[ ? ]=[1;97m  Bot spawned.[0m`)
	});
	bot.on("respawn", () => {
		console.log(`[1;32m=[ ? ]=[1;97m  Bot respawned (changed dimensions or died)[0m`)
	});

	bot.on("message", (message, messagePosition) => {
		if (messagePosition == "chat") console.log(`[2;36m${time()}${message.toAnsi()}`);
	});

	// Log errors and kick reasons:
	bot.on('kicked', createIns)
	bot.on('error', (...g) => {
		console.log(...g)
		createIns()
	})

	lbot = bot;
}

const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on("line", (input) => {
	if (input === "@quit") {
		if (!lbot) return console.log("Bot is not running!")
		lbot.quit()
		delete lbot
	} else if (input.startsWith("@sethost")) {
		host = input.replace("@sethost ", "")
		console.log(`============= Server: [1;97m${host}[0m`);
		console.log(`============= Username: [1;97m${botname}[0m`);
	} else if (input.startsWith("@setuser")) {
		botname = input.replace("@setuser ", "")
		console.log(`============= Server: [1;97m${host}[0m`);
		console.log(`============= Username: [1;97m${botname}[0m`);
	} else if (input === "@info") {
		console.log(`============= Server: [1;97m${host}[0m`);
		console.log(`============= Username: [1;97m${botname}[0m`);
	} else if (input === "@start") {
		createIns()
	}
});

console.log("Commands: [1;97m@setuser <user>[0m");
console.log("          [1;97m@sethost <server ip>[0m");
console.log("          [1;97m@info[0m");
console.log("          [1;97m@start[0m");
console.log("          [1;97m@quit[0m");
console.log("")
