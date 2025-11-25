module.exports.config = {
	name: "help2",
	version: "PLATINUM", 
	hasPermssion: 0,
	credits: "𝐌.𝐫 𝐀𝐫𝐲𝐚𝐧",
	description: "💎 𝐏𝐋𝐀𝐓𝐈𝐍𝐔𝐌 𝐇𝐄𝐋𝐏 - 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐄𝐃𝐈𝐓𝐈𝐎𝐍",
	commandCategory: "system",
	usages: "[cmd]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: false,
		delayUnsend: 240
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": `◥▶ 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝘾𝘼𝙍𝘿 ◀◤

╭─━━━━━─━━━━━─━━━━━─╮
         🎯 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝙄𝙉𝙁𝙊
╰─━━━━━─━━━━━─━━━━━─╯

✨ 𝙉𝘼𝙈𝙀: %1
📖 𝘿𝙀𝙎𝘾: %2  
⚡ 𝙐𝙎𝘼𝙂𝙀: %3
📂 𝘾𝘼𝙏𝙀𝙂𝙊𝙍𝙔: %4
⏰ 𝘾𝙊𝙊𝙇𝘿𝙊𝙒𝙉: %5s
🔐 𝙋𝙀𝙍𝙈𝙄𝙎𝙎𝙄𝙊𝙉: %6
👨‍💻 𝘿𝙀𝙑𝙀𝙇𝙊𝙋𝙀𝙍: %7

╭─━━━━━─━━━━━─━━━━━─╮
 💎 𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 𝗔𝗥𝗬𝗔𝗡
╰─━━━━━─━━━━━─━━━━━─╯`,
		"helpList": "💎 𝙏𝙤𝙩𝙖𝙡 %1 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨 • 𝙐𝙨𝙚 \"%2𝙝𝙚𝙡𝙥2 <𝙘𝙢𝙙>\"",
		"user": "👤 𝙐𝙨𝙚𝙧",
		"adminGroup": "👑 𝘼𝙙𝙢𝙞𝙣", 
		"adminBot": "🤖 𝘽𝙤𝙩 𝘼𝙙𝙢𝙞𝙣"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

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

		// 💎 PREMIUM PLATINUM DESIGN - FIXED STRING REPEAT ISSUES
		let helpMenu = `◥▶ 𝘼𝙍𝙔𝘼𝙉 𝘽𝙊𝙏 - 𝙋𝙇𝘼𝙏𝙄𝙉𝙐𝙈 𝙀𝘿𝙄𝙏𝙄𝙊𝙉 ◀◤

╔══════════════════════════════════════╗
            💫 𝘼𝙍𝙔𝘼𝙉 𝘽𝙊𝙏 💫
╚══════════════════════════════════════╝

◈ 𝙏𝙤𝙩𝙖𝙡 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨: ${totalCommands}
◈ 𝘽𝙤𝙩 𝙋𝙧𝙚𝙛𝙞𝙭: [ ${prefix} ]
◈ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: 𝙋𝙇𝘼𝙏𝙄𝙉𝙐𝙈
◈ 𝙊𝙬𝙣𝙚𝙧:𝐀𝐫𝐲𝐚𝐧 𝐱𝐫 𝐍𝐢𝐭𝐲𝐚
◈ 𝙎𝙩𝙖𝙩𝙪𝙨: 🟢 𝙊𝙣𝙡𝙞𝙣𝙚 & 𝘼𝙘𝙩𝙞𝙫𝙚

╔══════════════════════════════════════╗
            🎯 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝘾𝘼𝙏𝙀𝙂𝙊𝙍𝙄𝙀𝙎
╚══════════════════════════════════════╝`;

		// 💎 PREMIUM CATEGORIES WITH ICONS
		const categories = [
			{ 
				title: "🤖 𝘼𝙄 & 𝘾𝙃𝘼𝙏", 
				commands: ["ai", "gpt", "bard", "simsimi", "chat", "maria", "openai"],
				icon: "🤖",
				style: "🔷",
				color: "🔵"
			},
			{ 
				title: "🎮 𝙂𝘼𝙈𝙄𝙉𝙂", 
				commands: ["game", "casino", "slot", "dice", "rps", "quiz", "mine"],
				icon: "🎮", 
				style: "🎯",
				color: "🟢"
			},
			{ 
				title: "🖼️ 𝙄𝙈𝘼𝙂𝙀", 
				commands: ["edit", "avt", "pp", "meme", "create", "generate", "img"],
				icon: "🖼️",
				style: "💜", 
				color: "🟣"
			},
			{ 
				title: "👥 𝙂𝙍𝙊𝙐𝙋", 
				commands: ["adduser", "ban", "kick", "setname", "admin", "members", "boxinfo"],
				icon: "👥",
				style: "💛",
				color: "🟡"
			},
			{ 
				title: "🎵 𝙈𝙀𝘿𝙄𝘼", 
				commands: ["song", "video", "yt", "mp3", "play", "music", "getvideo"],
				icon: "🎵",
				style: "❤️",
				color: "🔴"
			},
			{ 
				title: "⚡ 𝙏𝙊𝙊𝙇𝙎", 
				commands: ["getlink", "removebg", "translate", "qr", "weather", "time", "scan"],
				icon: "⚡",
				style: "💚",
				color: "🟢"
			},
			{ 
				title: "😄 𝙁𝙐𝙉", 
				commands: ["hug", "kiss", "marry", "couple", "joke", "meme", "truth", "dare"],
				icon: "😄",
				style: "💖",
				color: "❤️"
			},
			{ 
				title: "👑 𝘼𝘿𝙈𝙄𝙉", 
				commands: ["admin", "settings", "config", "eval", "shell", "broadcast", "approve"],
				icon: "👑",
				style: "🔥",
				color: "🟠"
			}
		];

		// Display premium categories - FIXED STRING REPEAT
		categories.forEach(category => {
			const availableCmds = category.commands.filter(cmd => commands.has(cmd));
			if (availableCmds.length > 0) {
				helpMenu += `\n\n${category.color} ${category.icon} ${category.title}`;
				
				// Fixed string repeat with safe values
				const boxWidth = 38;
				const safeWidth = Math.max(10, Math.min(boxWidth, 50)); // Ensure safe range
				const borderLine = "─".repeat(safeWidth);
				
				helpMenu += `\n╭─${borderLine}─╮`;
				
				// Smart command display with safe padding
				let currentLine = "";
				const lines = [];
				
				availableCmds.forEach(cmd => {
					const cmdText = `${prefix}${cmd}`;
					if (currentLine.length + cmdText.length > safeWidth) {
						lines.push(currentLine);
						currentLine = cmdText;
					} else {
						currentLine += (currentLine ? " • " : "") + cmdText;
					}
				});
				if (currentLine) lines.push(currentLine);
				
				lines.forEach(line => {
					const safePadding = Math.max(0, Math.min(safeWidth, safeWidth - line.length));
					helpMenu += `\n│ ${line}${" ".repeat(safePadding)} │`;
				});
				
				helpMenu += `\n╰─${borderLine}─╯`;
			}
		});

		helpMenu += `\n\n╔══════════════════════════════════════╗
            🃏 𝙍𝙀𝘾𝙊𝙈𝙈𝙀𝙉𝘿𝙀𝘿 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎
╚══════════════════════════════════════╝`;

		// Premium command grid - FIXED STRING REPEAT
		const featuredCommands = arrayInfo.slice(0, 12);
		const rows = [];
		const gridWidth = 40;
		const safeGridWidth = Math.max(20, Math.min(gridWidth, 50)); // Safe range
		
		for (let i = 0; i < featuredCommands.length; i += 3) {
			const rowCommands = featuredCommands.slice(i, i + 3);
			let row = "│ ";
			rowCommands.forEach((cmd, index) => {
				const cmdDisplay = `✨ ${prefix}${cmd}`;
				row += cmdDisplay.slice(0, 12).padEnd(12); // Limit to 12 chars
				if (index < rowCommands.length - 1) row += " ▸ ";
			});
			
			// Safe padding calculation
			const currentLength = row.length;
			const safePadding = Math.max(0, Math.min(safeGridWidth, safeGridWidth + 2 - currentLength));
			row += " ".repeat(safePadding) + "│";
			rows.push(row);
		}
		
		// Safe border creation
		const safeBorder = "─".repeat(Math.max(20, Math.min(safeGridWidth, 45)));
		helpMenu += `\n╭─${safeBorder}─╮`;
		helpMenu += `\n${rows.join('\n')}`;
		helpMenu += `\n╰─${safeBorder}─╯`;

		if (arrayInfo.length > 12) {
			helpMenu += `\n\n📊 ...𝙖𝙣𝙙 ${arrayInfo.length - 12} 𝙢𝙤𝙧𝙚 𝙥𝙧𝙚𝙢𝙞𝙪𝙢 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨!`;
		}

		helpMenu += `\n\n╔══════════════════════════════════════╗
            📖 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝙂𝙐𝙄𝘿𝙀
╚══════════════════════════════════════╝
◈ ${prefix}help2 <command>  - 𝘾𝙤𝙢𝙢𝙖𝙣𝙙 𝙙𝙚𝙩𝙖𝙞𝙡𝙨
◈ ${prefix}help2 ai        - 𝘼𝙄 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨
◈ ${prefix}help2 game      - 𝙂𝙖𝙢𝙞𝙣𝙜 𝙛𝙚𝙖𝙩𝙪𝙧𝙚𝙨  
◈ ${prefix}help2 admin     - 𝘼𝙙𝙢𝙞𝙣 𝙩𝙤𝙤𝙡𝙨

╔══════════════════════════════════════╗
            💎 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝙄𝙉𝙁𝙊
╚══════════════════════════════════════╝
✨ 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧: 𝐌.𝐫 𝐀𝐫𝐲𝐚𝐧
🤖 𝘽𝙤𝙩: 𝘼𝙧𝙮𝙖𝙣 𝘽𝙤𝙩 𝙋𝙡𝙖𝙩𝙞𝙣𝙪𝙢
👑 𝙊𝙬𝙣𝙚𝙧: 𝐀𝐫𝐲𝐚𝐧 𝐱𝐫 𝐍𝐢𝐭𝐲𝐚
🎨 𝘿𝙚𝙨𝙞𝙜𝙣: 𝘼𝙧𝙮𝙖𝙣 𝙀𝙙𝙞𝙩𝙞𝙤𝙣
⏰ 𝘼𝙪𝙩𝙤-𝙘𝙡𝙚𝙖𝙣: 4 𝙢𝙞𝙣𝙪𝙩𝙚𝙨

◥▶ 𝙏𝙃𝘼𝙉𝙆 𝙔𝙊𝙐 𝙁𝙊𝙍 𝙐𝙎𝙄𝙉𝙂 𝘼𝙍𝙔𝘼𝙉 𝘽𝙊𝙏! ◀◤`;

		// Send with premium reactions
		return api.sendMessage(helpMenu, threadID, (error, info) => {
			if (error) {
				console.error("Help2 command error:", error);
				// Fallback simple help
				const simpleHelp = `🤖 Maria Bot Help\nCommands: ${totalCommands}\nPrefix: ${prefix}\nUse: ${prefix}help2 <command>`;
				return api.sendMessage(simpleHelp, threadID, messageID);
			}
			
			// Premium reaction sequence
			try {
				const premiumReactions = ["💎", "✨", "⭐", "🔥", "🎯", "👑"];
				premiumReactions.forEach((reaction, index) => {
					setTimeout(() => {
						api.setMessageReaction(reaction, info.messageID, () => {}, true);
					}, (index + 1) * 600);
				});
			} catch (e) {
				// Ignore reaction errors
			}

			// Auto delete after 4 minutes
			setTimeout(() => {
				try {
					api.unsendMessage(info.messageID);
				} catch (e) {}
			}, 240000);
		});
	}

	// Individual command premium card
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
