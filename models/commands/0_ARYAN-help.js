module.exports.config = {
  name: "help",
  version: "4.0.0", 
  hasPermssion: 0,
  credits: "Leiam Nash | 🚀 NEXT LEVEL PREMIUM",
  description: "🚀 NEXT LEVEL PREMIUM COMMAND SYSTEM",
  commandCategory: "system",
  usages: "[cmd] | [page] | all | categories | search",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": `┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
       🎯 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📛 𝗡𝗮𝗺𝗲: %1
📖 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %2
⚡ 𝗨𝘀𝗮𝗴𝗲: %3
📁 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4
⏰ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %5s
🔐 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6
👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿: %7

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
          𝐄𝐍𝐃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
    
    "helpList": `✨ 𝐍𝐄𝐗𝐓 𝐋𝐄𝐕𝐄𝐋 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐒𝐘𝐒𝐓𝐄𝐌 ✨

📊 Total Commands: %1
💡 Usage: "%2help <command>"
🎯 Features:
   • "help all" - Complete command list
   • "help categories" - Browse by category
   • "help search <keyword>" - Search commands
   • "help <page>" - Paginated view`,

    "user": "👤 User",
    "adminGroup": "🛡️ Admin Group", 
    "adminBot": "👑 Bot Admin",
    
    "categoryList": `📂 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 𝐒𝐘𝐒𝐓𝐄𝐌

%s

💡 Usage: "help category <name>"
🔍 Search: "help search <keyword>"
📊 Total Categories: %d`,
    
    "searchResults": `🔍 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓𝐒

Search: "%s"
Found: %d command(s)

%s
💡 Use "help <command>" for details`
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
  const axios = require("axios");
  const request = require('request');
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  // 🚀 NEXT LEVEL PREMIUM BACKGROUNDS
  const premiumBackgrounds = [
    "https://i.ibb.co/FL2bz1wt/b43c5f7b1645b84c173d42d6352c5bea.jpg",
    "https://i.ibb.co/jZx2QsnJ/aa0d339a144cbff54c811b2dadc45aa8.jpg", 
    "https://i.ibb.co/JjCwgwnB/105c5a85175ee00d51792cffeea39e51.jpg",
    "https://i.ibb.co/1t9stwFJ/e68cbcc8c0a181faa93ccdaab26221c8.jpg",
    "https://i.ibb.co/DfCkrstq/e3b4cc70d0357500215d7ec2e7997b78.jpg"
  ];

  // 🔍 SEARCH FUNCTIONALITY
  if (args[0] === "search" && args[1]) {
    const searchTerm = args.slice(1).join(" ").toLowerCase();
    const results = [];
    
    for (const [name, cmd] of commands) {
      if (name.toLowerCase().includes(searchTerm) || 
          cmd.config.description.toLowerCase().includes(searchTerm) ||
          cmd.config.commandCategory.toLowerCase().includes(searchTerm)) {
        results.push(name);
      }
    }
    
    if (results.length === 0) {
      return api.sendMessage(`❌ No commands found for: "${searchTerm}"`, threadID, messageID);
    }
    
    let searchMsg = "";
    results.forEach((cmd, index) => {
      searchMsg += `${index + 1}. ${prefix}${cmd}\n`;
    });
    
    const searchMessage = getText("searchResults", searchTerm, results.length, searchMsg);
    
    var callback = () => api.sendMessage({ 
      body: searchMessage,
      attachment: fs.createReadStream(__dirname + "/cache/premium_search.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/premium_search.jpg"), event.messageID);
    
    return request(encodeURI(premiumBackgrounds[Math.floor(Math.random() * premiumBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/premium_search.jpg")).on("close", () => callback());
  }

  // 📂 CATEGORY SYSTEM
  if (args[0] === "categories" || args[0] === "category") {
    const categories = new Map();
    
    for (const [name, cmd] of commands) {
      const category = cmd.config.commandCategory;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(name);
    }
    
    let categoryList = "";
    let index = 1;
    
    const sortedCategories = Array.from(categories.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    for (const [category, cmds] of sortedCategories) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      const emoji = getCategoryEmoji(category);
      categoryList += `${emoji} ${index}. ${categoryName}\n   └─ 📊 ${cmds.length} commands\n\n`;
      index++;
    }
    
    const categoryMessage = getText("categoryList", categoryList, categories.size);
    
    var callback = () => api.sendMessage({ 
      body: categoryMessage,
      attachment: fs.createReadStream(__dirname + "/cache/premium_categories.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/premium_categories.jpg"), event.messageID);
    
    return request(encodeURI(premiumBackgrounds[Math.floor(Math.random() * premiumBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/premium_categories.jpg")).on("close", () => callback());
  }

  // 🚀 ALL COMMANDS - NEXT LEVEL VIEW
  if (args[0] == "all") {
    const command = commands.values();
    var group = new Map();
    let msg = "";
    
    // 🚀 NEXT LEVEL HEADER
    msg += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
    msg += `        🚀 𝐍𝐄𝐗𝐓 𝐋𝐄𝐕𝐄𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 🚀\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
    msg += `🎯 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓\n\n`;
    
    for (const commandConfig of command) {
      const category = commandConfig.config.commandCategory;
      if (!group.has(category)) {
        group.set(category, []);
      }
      group.get(category).push(commandConfig.config.name);
    }
    
    // Sort categories alphabetically
    const sortedCategories = Array.from(group.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    sortedCategories.forEach(([category, cmds]) => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      const emoji = getCategoryEmoji(category);
      msg += `${emoji} 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${categoryName}\n`;
      msg += `┌${'─'.repeat(32)}┐\n`;
      
      // Group commands in chunks of 4 for better layout
      for (let i = 0; i < cmds.length; i += 4) {
        const chunk = cmds.slice(i, i + 4);
        const commandLine = chunk.map(cmd => `• ${cmd}`).join('  ');
        msg += `│ ${commandLine}${' '.repeat(30 - commandLine.length)} │\n`;
      }
      
      msg += `└${'─'.repeat(32)}┘\n\n`;
    });

    // 🎊 NEXT LEVEL FOOTER
    msg += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
    msg += `📊 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐔𝐒\n`;
    msg += `├─ Total Commands: ${commands.size}\n`;
    msg += `├─ Total Categories: ${sortedCategories.length}\n`;
    msg += `├─ Prefix: ${prefix}\n`;
    msg += `├─ Version: 4.0.0 NEXT LEVEL\n`;
    msg += `└─ Status: 🟢 ONLINE\n\n`;
    msg += `💡 𝐔𝐒𝐀𝐆𝐄 𝐆𝐔𝐈𝐃𝐄\n`;
    msg += `├─ ${prefix}help <command>\n`;
    msg += `├─ ${prefix}help categories\n`;
    msg += `├─ ${prefix}help search <keyword>\n`;
    msg += `├─ ${prefix}help <page>\n`;
    msg += `└─ ${prefix}help all\n\n`;
    msg += `⚡ 𝐍𝐄𝐗𝐓 𝐋𝐄𝐕𝐄𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐕4.0\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

    return api.sendMessage({ 
      body: msg
    }, event.threadID, (err, info) => {
      if (autoUnsend == false) {
        setTimeout(() => { 
          return api.unsendMessage(info.messageID);
        }, delayUnsend * 1000);
      }
    }, event.messageID);
  };

  // 📄 PAGINATED VIEW - NEXT LEVEL ENHANCED
  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 20;
    let i = 0;
    let msg = "";

    for (var [name, value] of (commands)) {
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.localeCompare(b));
    const first = numberOfOnePage * page - numberOfOnePage;
    i = first;
    const helpView = arrayInfo.slice(first, first + numberOfOnePage);
    const totalPages = Math.ceil(arrayInfo.length/numberOfOnePage);

    // 🎨 NEXT LEVEL HEADER
    msg += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
    msg += `          🎯 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🎯\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;

    // 📝 COMMAND LIST WITH BETTER NUMBERING
    helpView.forEach((cmds, index) => {
      const num = first + index + 1;
      const emoji = getCommandEmoji(cmds);
      msg += `${emoji} ${num.toString().padStart(2, '0')}. ${global.config.PREFIX}${cmds}\n`;
    });

    // 📊 NEXT LEVEL FOOTER
    msg += `\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
    msg += `📄 Page: ${page}/${totalPages}\n`;
    msg += `📊 Total: ${arrayInfo.length} commands\n`;
    msg += `🔧 Prefix: ${prefix}\n`;
    msg += `└──────────────────────────────────┘\n\n`;
    msg += `🎯 𝐍𝐀𝐕𝐈𝐆𝐀𝐓𝐈𝐎𝐍\n`;
    msg += `├─ ${prefix}help all\n`;
    msg += `├─ ${prefix}help categories\n`;
    msg += `├─ ${prefix}help search <keyword>\n`;
    msg += `├─ ${prefix}help <command>\n`;
    if (page < totalPages) msg += `├─ ${prefix}help ${page + 1}\n`;
    if (page > 1) msg += `├─ ${prefix}help ${page - 1}\n`;
    msg += `└─ ${prefix}help 1\n\n`;
    msg += `⚡ 𝐍𝐄𝐗𝐓 𝐋𝐄𝐕𝐄𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐕4.0\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

    var callback = () => api.sendMessage({ 
      body: msg, 
      attachment: fs.createReadStream(__dirname + "/cache/premium_help.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/premium_help.jpg"), event.messageID);
    
    return request(encodeURI(premiumBackgrounds[Math.floor(Math.random() * premiumBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/premium_help.jpg")).on("close", () => callback());
  } 

  // 🎯 SINGLE COMMAND VIEW
  const leiamname = getText("moduleInfo", command.config.name, command.config.description, `${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits);

  var callback = () => api.sendMessage({ 
    body: leiamname, 
    attachment: fs.createReadStream(__dirname + "/cache/premium_command.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/premium_command.jpg"), event.messageID);
  
  return request(encodeURI(premiumBackgrounds[Math.floor(Math.random() * premiumBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/premium_command.jpg")).on("close", () => callback());
};

// 🎯 EMOJI FUNCTIONS FOR BETTER VISUALS
function getCategoryEmoji(category) {
  const emojiMap = {
    'system': '⚙️',
    'game': '🎮',
    'fun': '🎯',
    'music': '🎵',
    'image': '🖼️',
    'video': '🎬',
    'tool': '🛠️',
    'utility': '🔧',
    'group': '👥',
    'user': '👤',
    'admin': '👑',
    'nsfw': '🔞',
    'download': '📥',
    'create': '🎨'
  };
  return emojiMap[category.toLowerCase()] || '📁';
}

function getCommandEmoji(command) {
  if (command.includes('game') || command.includes('play')) return '🎮';
  if (command.includes('music') || command.includes('song')) return '🎵';
  if (command.includes('image') || command.includes('img')) return '🖼️';
  if (command.includes('video') || command.includes('movie')) return '🎬';
  if (command.includes('admin') || command.includes('mod')) return '👑';
  if (command.includes('group') || command.includes('box')) return '👥';
  if (command.includes('search') || command.includes('find')) return '🔍';
  if (command.includes('download') || command.includes('get')) return '📥';
  if (command.includes('create') || command.includes('make')) return '🎨';
  return '✨';
}
