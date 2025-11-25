module.exports.config = {
	name: "help2",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "Beginner's Guide",
	commandCategory: "system",
	usages: "[Tên module]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: true,
		delayUnsend: 300
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
		"helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
		"user": "User",
		"adminGroup": "Admin group",
		"adminBot": "Admin bot"
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
	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	if (!command) {
		const arrayInfo = [];
		const page = parseInt(args[0]) || 1;
		const numberOfOnePage = 9999;
		let i = 0;
		let msg = "";
		
		for (var [name, value] of (commands)) {
			name += ``;
			arrayInfo.push(name);
		}

		arrayInfo.sort((a, b) => a.data - b.data);
		
		const startSlice = numberOfOnePage*page - numberOfOnePage;
		i = startSlice;
		const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
		
		for (let item of returnArray) msg += `「 ${++i} 」${prefix}${item}\n`;
		
		// Create the help menu with all categories
		let helpMenu = `╭──❏ 𝐀𝐮𝐭𝐨 𝐃𝐞𝐭𝐞𝐜𝐭 𝐇𝐞𝐥𝐩 ❏──╮\n`;
		helpMenu += `│ ✧ Total Commands: ${arrayInfo.length}\n`;
		helpMenu += `│ ✧ Prefix: ${prefix}\n`;
		helpMenu += `╰─────────────────────⭓\n\n`;

		// Add all categories and commands
		helpMenu += `╭─────⭓ NO PREFIX\n`;
		helpMenu += `│ ✧gali ✧✧suar ✧✧fyoutoo ✧✧gali ✧✧rumana\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ FUN\n`;
		helpMenu += `│ ✧maria ✧✧needgf ✧✧reedit ✧✧truefalse ✧✧truthordare\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ ADMIN\n`;
		helpMenu += `│ ✧out ✧✧admin ✧✧allbox ✧✧approve ✧✧appstate ✧✧by ✧✧callad ✧✧file ✧✧load ✧✧leave ✧✧setprofile ✧✧unban ✧✧vip\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ NOPREFIX\n`;
		helpMenu += `│ ✧😔 ✧✧😅 ✧✧fixspam-chuibot ✧✧babyteach ✧✧bot ✧✧rules\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GAME\n`;
		helpMenu += `│ ✧3card ✧✧baicao ✧✧banbaucua ✧✧banchim ✧✧bantaixiu ✧✧bc ✧✧mine ✧✧quiz\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ IMAGE EDITING TOOLS\n`;
		helpMenu += `│ ✧4k\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ ADMIN\n`;
		helpMenu += `│ ✧bio ✧✧config ✧✧delete ✧✧setkey ✧✧settings\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GROUP\n`;
		helpMenu += `│ ✧rank ✧✧setemoji ✧✧setprefix\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ FRIEND REQUEST\n`;
		helpMenu += `│ ✧acp\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ SYSTEM\n`;
		helpMenu += `│ ✧actionGuard ✧✧cmd ✧✧gettoken ✧✧join ✧✧language ✧✧leave ✧✧listban ✧✧listbox ✧✧logout ✧✧resetexp ✧✧rnamebox ✧✧shell ✧✧spamban ✧✧stt\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ MEDIA\n`;
		helpMenu += `│ ✧ckbot ✧✧album ✧✧ckuser ✧✧Convert\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GROUP\n`;
		helpMenu += `│ ✧adduser ✧✧ban ✧✧lock ✧✧tid ✧✧warn\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ AI\n`;
		helpMenu += `│ ✧ai ✧✧openai\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GENERAL\n`;
		helpMenu += `│ ✧allgc\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ SYSTEM\n`;
		helpMenu += `│ ✧message ✧✧antijoin ✧✧antiout ✧✧birthdayAuto ✧✧clearcache ✧✧cs ✧✧custom ✧✧help ✧✧menu ✧✧pending ✧✧prefix ✧✧restart ✧✧setphoto ✧✧typingtest ✧✧unsend ✧✧upt ✧✧uptime ✧✧user\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ MODERATION\n`;
		helpMenu += `│ ✧antigali\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ USER\n`;
		helpMenu += `│ ✧autodl ✧✧qr ✧✧scan\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ NO PREFIX\n`;
		helpMenu += `│ ✧autoreact\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ TOOLS\n`;
		helpMenu += `│ ✧autoseen\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ CÔNG CỤ\n`;
		helpMenu += `│ ✧avt ✧✧pp\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ CHAT\n`;
		helpMenu += `│ ✧baby\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ AUTO\n`;
		helpMenu += `│ ✧babyimg ✧✧babylove\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ ECONOMY\n`;
		helpMenu += `│ ✧bal\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ TIỆN ÍCH\n`;
		helpMenu += `│ ✧bank ✧✧fbsearch1 ✧✧ndfb\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ PNG\n`;
		helpMenu += `│ ✧bestie ✧✧bestu ✧✧crush\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ IMG\n`;
		helpMenu += `│ ✧bf ✧✧gf ✧✧married\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ INFO\n`;
		helpMenu += `│ ✧birthday ✧✧siteinf ✧✧owner\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ FUN\n`;
		helpMenu += `│ ✧bkashf ✧✧simsimi\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ 18+ COMMAND\n`;
		helpMenu += `│ ✧boobs\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ CONFIG\n`;
		helpMenu += `│ ✧otherbots ✧✧self ✧✧setjoin\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ BOX\n`;
		helpMenu += `│ ✧group\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ BOX\n`;
		helpMenu += `│ ✧boxinfo ✧✧group\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ UTILITY\n`;
		helpMenu += `│ ✧busy ✧✧install ✧✧color ✧✧copy ✧✧ffinfo ✧✧give ✧✧playlyrics ✧✧rxhit ✧✧spam ✧✧tag\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GAMES\n`;
		helpMenu += `│ ✧casino\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ LOVE\n`;
		helpMenu += `│ ✧couple ✧✧marry\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GAME\n`;
		helpMenu += `│ ✧dating ✧✧hug ✧✧kbb ✧✧kick ✧✧kiss ✧✧pokemon ✧✧punch ✧✧rob ✧✧slap\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ CREATE A PHOTO\n`;
		helpMenu += `│ ✧family\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ COVER\n`;
		helpMenu += `│ ✧fbcover\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ 𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥\n`;
		helpMenu += `│ ✧flux\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ IMAGE\n`;
		helpMenu += `│ ✧fp ✧✧imagesearch ✧✧imagine\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ TOOL\n`;
		helpMenu += `│ ✧getlink ✧✧removebg\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ MEDIA\n`;
		helpMenu += `│ ✧getpix ✧✧getvideo ✧✧inbox ✧✧song ✧✧tenor ✧✧tns ✧✧translate ✧✧ar ✧✧video ✧✧x ✧✧youtube\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ BOX CHAT\n`;
		helpMenu += `│ ✧listadmin ✧✧listadmin ✧✧setname\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ HACK\n`;
		helpMenu += `│ ✧hack\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ QTV BOX\n`;
		helpMenu += `│ ✧hi\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ OTHER\n`;
		helpMenu += `│ ✧imgur ✧✧ip ✧✧ss\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ ...\n`;
		helpMenu += `│ ✧info\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ RANDOM-IMG\n`;
		helpMenu += `│ ✧japan\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ M H BD\n`;
		helpMenu += `│ ✧love\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ PICTURE\n`;
		helpMenu += `│ ✧match ✧✧pair ✧✧pair1 ✧✧rip\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ STUDY\n`;
		helpMenu += `│ ✧math\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ STUDY, LEARN MORE, LEARN FOREVER\n`;
		helpMenu += `│ ✧mathematics\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ NSFW\n`;
		helpMenu += `│ ✧Power\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ IMAGE\n`;
		helpMenu += `│ ✧meme ✧✧toilet\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ OTHER\n`;
		helpMenu += `│ ✧goiadmin\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ VIDEO CONVERT AUDIO\n`;
		helpMenu += `│ ✧mp3\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ INFORMATION\n`;
		helpMenu += `│ ✧numinfo\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ UTILITY\n`;
		helpMenu += `│ ✧paste ✧✧proxy\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ SEARCH\n`;
		helpMenu += `│ ✧pic\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ TOOL\n`;
		helpMenu += `│ ✧pixup\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ GENERAL\n`;
		helpMenu += `│ ✧resend\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ BONDING\n`;
		helpMenu += `│ ✧sala\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ TRÒ CHƠI\n`;
		helpMenu += `│ ✧slot\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ TOOLS\n`;
		helpMenu += `│ ✧uid\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `╭─────⭓ VIDEO\n`;
		helpMenu += `│ ✧videomix\n`;
		helpMenu += `╰────────────⭓\n\n`;

		helpMenu += `⭔ Type ${prefix}help [command] to see details\n`;
		helpMenu += `╭─[⋆˚🦋𝐍𝐢𝐭𝐲𝐚 × 𝐫𝐗🎀⋆˚]\n`;
		helpMenu += `╰‣ 𝐀𝐝𝐦𝐢𝐧 : 𝐫𝐗 𝐀𝐫𝐲𝐚𝐧`;

		return api.sendMessage(helpMenu, threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
				return api.unsendMessage(info.messageID);
			} else return;
		}, event.messageID);
	}

	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};
