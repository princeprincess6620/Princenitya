module.exports.config = {
	name: "help2",
	version: "5.0.0", 
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "🎴 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐂𝐀𝐑𝐃 𝐇𝐄𝐋𝐏 - 𝐈𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐯𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐆𝐮𝐢𝐝𝐞",
	commandCategory: "system",
	usages: "[command/category]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: false,
		delayUnsend: 120
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "🃏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐀𝐑𝐃\n\n┏━━━━━━━━━━━━━━━━━━┓\n┃    🎯 𝐂𝐀𝐑𝐃 𝐈𝐍𝐅𝐎    ┃\n┗━━━━━━━━━━━━━━━━━━┛\n\n🃏 𝐍𝐚𝐦𝐞: %1\n📝 𝐃𝐞𝐬𝐜: %2\n⚡ 𝐔𝐬𝐚𝐠𝐞: %3\n📁 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: %4\n⏱️ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: %5s\n🔐 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %6\n👨‍💻 𝐃𝐞𝐯: %7\n\n┏━━━━━━━━━━━━━━━━━━┓\n┃  ⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘   ┃\n┗━━━━━━━━━━━━━━━━━━┛\n       𝐌𝐀𝐑𝐈𝐀 𝐁𝐎𝐓",
		"helpList": "🃏 𝐓𝐨𝐭𝐚𝐥 %1 𝐜𝐚𝐫𝐝𝐬 • \"%2help2 <𝐜𝐦𝐝>\"",
		"user": "👤 𝐔𝐬𝐞𝐫",
		"adminGroup": "👑 𝐀𝐝𝐦𝐢𝐧", 
		"adminBot": "🤖 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

	// Only respond to help2 command
	if (!body || typeof body == "undefined" || body.indexOf("help2") != 0) return;
	
	const splitBody = body.slice(body.indexOf("help2")).trim().split(/\s+/);
	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
	
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	
	const commandInfo = getText("moduleInfo", 
		command.config.name,
		command.config.description, 
		`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
		command.config.commandCategory, 
		command.config.cooldowns, 
		((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
		command.config.credits
	);
	
	api.sendMessage(commandInfo, threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	if (!command) {
		const arrayInfo = Array.from(commands.keys());
		const totalCommands = arrayInfo.length;

		// 🎴 PREMIUM CARD DESIGN HELP MENU
		let helpMenu = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        🎴 𝐌𝐀𝐑𝐈𝐀 𝐁𝐎𝐓 𝐂𝐀𝐑𝐃𝐒        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        📊 𝐒𝐓𝐀𝐓𝐒 𝐂𝐀𝐑𝐃        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
🃏 𝐓𝐨𝐭𝐚𝐥 𝐂𝐚𝐫𝐝𝐬: ${totalCommands}
🎯 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}
👑 𝐎𝐰𝐧𝐞𝐫: 𝐫𝐗 𝐀𝐛𝐝𝐮𝐥𝐥𝐚𝐡
⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 5.0.0

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🎪 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 𝐂𝐀𝐑𝐃𝐒       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

		// 🎯 CARD STYLE CATEGORIES - MIRAI BOT COMPATIBLE
		const cardCategories = [
			{ 
				title: "🤖 𝐀𝐈 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["ai", "openai", "simsimi", "baby", "maria", "gpt", "bard"],
				color: "🟦"
			},
			{ 
				title: "🎮 𝐆𝐀𝐌𝐄 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["game", "casino", "slot", "quiz", "mine", "dice", "rps"],
				color: "🟩" 
			},
			{ 
				title: "🖼️ 𝐈𝐌𝐀𝐆𝐄 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["edit", "avt", "pp", "meme", "create", "generate", "img"],
				color: "🟪"
			},
			{ 
				title: "👥 𝐆𝐑𝐎𝐔𝐏 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["adduser", "ban", "kick", "setname", "boxinfo", "admin", "members"],
				color: "🟨"
			},
			{ 
				title: "🎵 𝐌𝐄𝐃𝐈𝐀 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["song", "video", "youtube", "mp3", "getvideo", "play", "music"],
				color: "🟥"
			},
			{ 
				title: "⚙️ 𝐓𝐎𝐎𝐋 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["getlink", "removebg", "translate", "qr", "scan", "weather", "time"],
				color: "🟧"
			},
			{ 
				title: "💖 𝐅𝐔𝐍 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["hug", "kiss", "marry", "couple", "truth", "dare", "joke"],
				color: "💗"
			},
			{ 
				title: "👑 𝐀𝐃𝐌𝐈𝐍 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["admin", "approve", "unban", "settings", "config", "eval", "shell"],
				color: "👑"
			}
		];

		// Display category cards
		cardCategories.forEach(category => {
			const availableCmds = category.commands.filter(cmd => commands.has(cmd));
			if (availableCmds.length > 0) {
				helpMenu += `\n${category.color} ${category.title}`;
				helpMenu += `\n┌─${'─'.repeat(26)}─┐`;
				
				// Split commands into chunks to fit in box
				const cmdChunks = [];
				let currentChunk = [];
				let currentLength = 0;
				
				availableCmds.forEach(cmd => {
					const cmdText = `${prefix}${cmd}`;
					if (currentLength + cmdText.length > 25) {
						cmdChunks.push([...currentChunk]);
						currentChunk = [cmdText];
						currentLength = cmdText.length;
					} else {
						currentChunk.push(cmdText);
						currentLength += cmdText.length + 2;
					}
				});
				if (currentChunk.length > 0) cmdChunks.push(currentChunk);
				
				cmdChunks.forEach(chunk => {
					helpMenu += `\n│ ${chunk.join(' ')}`;
				});
				helpMenu += `\n└─${'─'.repeat(26)}─┘\n`;
			}
		});

		helpMenu += `\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🃏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐀𝐑𝐃𝐒       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

		// Display first 12 commands in card format
		const displayCommands = arrayInfo.slice(0, 12);
		let commandGrid = "";
		
		for (let i = 0; i < displayCommands.length; i++) {
			if (i % 3 === 0) {
				if (i !== 0) commandGrid += `\n`;
				commandGrid += `│ `;
			}
			commandGrid += `🃏 ${prefix}${displayCommands[i].padEnd(10)}`;
			if ((i + 1) % 3 !== 0 && i !== displayCommands.length - 1) {
				commandGrid += ` • `;
			}
		}
		
		helpMenu += `\n${commandGrid}`;

		// Show remaining commands count
		if (arrayInfo.length > 12) {
			helpMenu += `\n\n📋 ...and ${arrayInfo.length - 12} more commands!`;
		}

		helpMenu += `\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       📖 𝐆𝐔𝐈𝐃𝐄 𝐂𝐀𝐑𝐃        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
🎴 ${prefix}help2 <command> - View card
🎴 ${prefix}help2 ai - AI commands  
🎴 ${prefix}help - Main help menu
🎴 ${prefix}menu - Alternative menu

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🌟 𝐂𝐑𝐄𝐃𝐈𝐓 𝐂𝐀𝐑𝐃        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
👨‍💻 𝐃𝐞𝐯: 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭
🤖 𝐁𝐨𝐭: 𝐌𝐚𝐫𝐢𝐚 𝐁𝐨𝐭 𝐕5
🎨 𝐃𝐞𝐬𝐢𝐠𝐧: 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐂𝐚𝐫𝐝𝐬
📱 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦: 𝐌𝐢𝐫𝐚𝐢 𝐁𝐨𝐭

${'╔' + '═'.repeat(30) + '╗'}
${'║' + ' '.repeat(30) + '║'}
║    🎴 𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐂𝐚𝐫𝐝𝐬! 🎴    ║
${'║' + ' '.repeat(30) + '║'}
${'╚' + '═'.repeat(30) + '╝'}`;

		// Send the help menu
		return api.sendMessage(helpMenu, threadID, (error, info) => {
			if (error) return console.error(error);
			
			// Add card-themed reactions if possible
			try {
				setTimeout(() => {
					api.setMessageReaction("🃏", info.messageID, () => {}, true);
					setTimeout(() => {
						api.setMessageReaction("🎴", info.messageID, () => {}, true);
					}, 500);
				}, 1000);
			} catch (e) {
				// Ignore reaction errors
			}

			// Auto delete after 2 minutes if enabled
			if (global.configModule[module.exports.config.name].envConfig.autoUnsend) {
				setTimeout(() => {
					api.unsendMessage(info.messageID);
				}, global.configModule[module.exports.config.name].envConfig.delayUnsend * 1000);
			}
		});
	}

	// 🎴 INDIVIDUAL COMMAND CARD
	const commandInfo = getText("moduleInfo", 
		command.config.name,
		command.config.description, 
		`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
		command.config.commandCategory, 
		command.config.cooldowns, 
		((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
		command.config.credits
	);

	return api.sendMessage(commandInfo, threadID, messageID);
};
