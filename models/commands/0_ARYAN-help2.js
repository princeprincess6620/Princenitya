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
		"moduleInfo": `🃏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐀𝐑𝐃

┏━━━━━━━━━━━━━━━━━━┓
┃    🎯 𝐂𝐀𝐑𝐃 𝐈𝐍𝐅𝐎    ┃
┗━━━━━━━━━━━━━━━━━━┛

🃏 𝐍𝐚𝐦𝐞: ${"%" + "1"}
📝 𝐃𝐞𝐬𝐜: ${"%" + "2"}
⚡ 𝐔𝐬𝐚𝐠𝐞: ${"%" + "3"}
📁 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${"%" + "4"}
⏱️ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: ${"%" + "5"}s
🔐 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: ${"%" + "6"}
👨‍💻 𝐃𝐞𝐯: ${"%" + "7"}

┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘   ┃
┗━━━━━━━━━━━━━━━━━━┛
       𝐌𝐀𝐑𝐈𝐀 𝐁𝐎𝐓`,
		"helpList": '🃏 𝐓𝐨𝐭𝐚𝐥 ${"%" + "1"} 𝐜𝐚𝐫𝐝𝐬 • "${"%" + "2"}𝐡𝐞𝐥𝐩 <𝐜𝐦𝐝>"',
		"user": "👤 𝐔𝐬𝐞𝐫",
		"adminGroup": "👑 𝐀𝐝𝐦𝐢𝐧", 
		"adminBot": "🤖 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

	if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
	const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	
	const commandInfo = getText("moduleInfo", 
		`${command.config.name}`,
		command.config.description, 
		`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
		command.config.commandCategory, 
		command.config.cooldowns, 
		((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
		command.config.credits
	);
	
	api.sendTypingIndicator(threadID, () => {
		api.sendMessage(commandInfo, threadID, messageID);
	});
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

		// 🎯 CARD STYLE CATEGORIES
		const cardCategories = [
			{ 
				title: "🤖 𝐀𝐈 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["ai", "openai", "simsimi", "baby", "maria"],
				color: "🟦"
			},
			{ 
				title: "🎮 𝐆𝐀𝐌𝐄 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["3card", "baicao", "casino", "slot", "quiz", "mine"],
				color: "🟩" 
			},
			{ 
				title: "🖼️ 𝐈𝐌𝐀𝐆𝐄 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["4k", "avt", "pp", "meme", "flux", "imagine"],
				color: "🟪"
			},
			{ 
				title: "👥 𝐆𝐑𝐎𝐔𝐏 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["adduser", "ban", "kick", "setname", "boxinfo"],
				color: "🟨"
			},
			{ 
				title: "🎵 𝐌𝐄𝐃𝐈𝐀 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["song", "video", "youtube", "mp3", "getvideo"],
				color: "🟥"
			},
			{ 
				title: "⚙️ 𝐓𝐎𝐎𝐋 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["getlink", "removebg", "translate", "qr", "scan"],
				color: "🟧"
			},
			{ 
				title: "💖 𝐅𝐔𝐍 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["hug", "kiss", "marry", "couple", "truthordare"],
				color: "💗"
			},
			{ 
				title: "👑 𝐀𝐃𝐌𝐈𝐍 𝐂𝐀𝐑𝐃𝐒", 
				commands: ["admin", "approve", "unban", "settings", "config"],
				color: "👑"
			}
		];

		// Display category cards
		cardCategories.forEach(category => {
			const availableCmds = category.commands.filter(cmd => commands.has(cmd));
			if (availableCmds.length > 0) {
				helpMenu += `\n${category.color} ${category.title}`;
				helpMenu += `\n┌─${'─'.repeat(28)}─┐`;
				helpMenu += `\n│ ${availableCmds.map(cmd => `${prefix}${cmd}`).join(' │ ')}`;
				helpMenu += `\n└─${'─'.repeat(28)}─┘\n`;
			}
		});

		helpMenu += `\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🃏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐀𝐑𝐃𝐒       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

		// Display commands in card format (3 columns)
		for (let i = 0; i < Math.min(15, arrayInfo.length); i++) {
			if (i % 3 === 0) {
				if (i !== 0) helpMenu += ` │\n`;
				helpMenu += `\n│ `;
			}
			helpMenu += `🃏 ${prefix}${arrayInfo[i].padEnd(12)}`;
			if ((i + 1) % 3 !== 0 && i !== arrayInfo.length - 1) {
				helpMenu += ` │ `;
			}
		}
		if (arrayInfo.length > 0) helpMenu += ` │`;

		helpMenu += `\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       📖 𝐆𝐔𝐈𝐃𝐄 𝐂𝐀𝐑𝐃        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
🎴 ${prefix}help <command> - View card
🎴 ${prefix}help ai - AI commands  
🎴 ${prefix}menu - Full menu
🎴 ${prefix}allcmds - All commands

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🌟 𝐂𝐑𝐄𝐃𝐈𝐓 𝐂𝐀𝐑𝐃        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
👨‍💻 𝐃𝐞𝐯: 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭
🤖 𝐁𝐨𝐭: 𝐌𝐚𝐫𝐢𝐚 𝐁𝐨𝐭 𝐕5
🎨 𝐃𝐞𝐬𝐢𝐠𝐧: 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐂𝐚𝐫𝐝𝐬
⏰ 𝐀𝐮𝐭𝐨-𝐜𝐥𝐨𝐬𝐞: 2 𝐦𝐢𝐧𝐬

${'╔' + '═'.repeat(30) + '╗'}
${'║' + ' '.repeat(30) + '║'}
║    🎴 𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐂𝐚𝐫𝐝𝐬! 🎴    ║
${'║' + ' '.repeat(30) + '║'}
${'╚' + '═'.repeat(30) + '╝'}`;

		// 🎭 SEND WITH TYPING EFFECT
		api.sendTypingIndicator(threadID, (err) => {
			if (err) return;
			api.sendMessage(helpMenu, threadID, (error, info) => {
				if (error) return console.error(error);
				
				// Add card-themed reactions
				setTimeout(() => {
					api.setMessageReaction("🃏", info.messageID, () => {}, true);
					api.setMessageReaction("🎴", info.messageID, () => {}, true);
					api.setMessageReaction("⭐", info.messageID, () => {}, true);
				}, 800);

				// Auto delete after 2 minutes
				setTimeout(() => {
					api.unsendMessage(info.messageID);
				}, 120000);
			});
		});
		return;
	}

	// 🎴 INDIVIDUAL COMMAND CARD
	const commandInfo = getText("moduleInfo", 
		`${command.config.name}`,
		command.config.description, 
		`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
		command.config.commandCategory, 
		command.config.cooldowns, 
		((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
		command.config.credits
	);

	api.sendTypingIndicator(threadID, () => {
		api.sendMessage(commandInfo, threadID, messageID);
	});
};

// 🎯 CARD THEMED ADDITIONAL FEATURES
global.cardHelp = {
	"ai": "🤖 AI & Chatting commands",
	"games": "🎮 Gaming and entertainment", 
	"image": "🖼️ Image editing and generation",
	"media": "🎵 Music and video commands",
	"tools": "⚙️ Utility and tools",
	"fun": "💖 Fun and interaction",
	"admin": "👑 Administration commands",
	"group": "👥 Group management"
};
