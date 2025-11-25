module.exports.config = {
  name: "help",
  version: "3.0.0", 
  hasPermssion: 0,
  credits: "Leiam Nash | ⚡ULTRA PREMIUM⚡",
  description: "⚡ ULTRA PREMIUM COMMAND SYSTEM ⚡",
  commandCategory: "system",
  usages: "[cmd] | [page] | all | categories",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": `╔═══════════════✦═══════════════╗
                 🎯 COMMAND INFO
╚═══════════════✦═══════════════╝

📛 𝗡𝗮𝗺𝗲: %1
📖 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %2
⚡ 𝗨𝘀𝗮𝗴𝗲: %3
📁 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4
⏰ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %5s
🔐 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6
👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿: %7

╔═══════════════✦═══════════════╗
                 𝗘𝗡𝗗
╚═══════════════✦═══════════════╝`,
    
    "helpList": `✨ 𝗨𝗟𝗧𝗥𝗔 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 ✨

📊 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: %1
💡 𝗨𝘀𝗮𝗴𝗲: "%2help <command>"
🎯 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀:
   • "help all" - Complete command list
   • "help categories" - Browse by category
   • "help <page>" - Paginated view`,

    "user": "👤 𝗨𝘀𝗲𝗿",
    "adminGroup": "🛡️ 𝗔𝗱𝗺𝗶𝗻 𝗚𝗿𝗼𝘂𝗽", 
    "adminBot": "👑 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻",
    
    "categoryList": `📂 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 𝗦𝗬𝗦𝗧𝗘𝗠

%s

💡 𝗨𝘀𝗮𝗴𝗲: "help category <name>"
📊 𝗧𝗼𝘁𝗮𝗹 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀: %d`
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

  // 🌟 ULTRA PREMIUM BACKGROUNDS
  const ultraBackgrounds = [
    "https://i.imgur.com/8N9xY7B.jpeg",
    "https://i.imgur.com/3QZz7qg.jpeg",
    "https://i.imgur.com/5M6T2kX.jpeg",
    "https://i.imgur.com/2Kj8W7q.jpeg",
    "https://i.imgur.com/9G8Z6YQ.jpeg",
    "https://i.imgur.com/X8v9L2f.jpeg",
    "https://i.imgur.com/L4p9R2s.jpeg",
    "https://i.imgur.com/N9p8Z2q.jpeg"
  ];

  // 🎯 CATEGORY SYSTEM
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
    
    for (const [category, cmds] of categories) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      categoryList += `📁 ${index}. ${categoryName}\n   └─ 📊 ${cmds.length} commands\n\n`;
      index++;
    }
    
    const categoryMessage = getText("categoryList", categoryList, categories.size);
    
    var callback = () => api.sendMessage({ 
      body: categoryMessage,
      attachment: fs.createReadStream(__dirname + "/cache/ultra_categories.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ultra_categories.jpg"), event.messageID);
    
    return request(encodeURI(ultraBackgrounds[Math.floor(Math.random() * ultraBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/ultra_categories.jpg")).on("close", () => callback());
  }

  // 🚀 ALL COMMANDS - ULTRA PREMIUM VIEW
  if (args[0] == "all") {
    const command = commands.values();
    var group = new Map();
    let msg = "";
    
    // 🌟 ULTRA PREMIUM HEADER
    msg += `╔════════════════════════════════════╗\n`;
    msg += `           ⚡ 𝗨𝗟𝗧𝗥𝗔 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 ⚡\n`;
    msg += `╚════════════════════════════════════╝\n\n`;
    msg += `🎯 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧\n\n`;
    
    for (const commandConfig of command) {
      const category = commandConfig.config.commandCategory;
      if (!group.has(category)) {
        group.set(category, []);
      }
      group.get(category).push(commandConfig.config.name);
    }
    
    // Sort categories alphabetically
    const sortedCategories = Array.from(group.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    sortedCategories.forEach(([category, cmds], categoryIndex) => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      msg += `📂 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${categoryName}\n`;
      msg += `├${'─'.repeat(35)}┤\n`;
      
      // Group commands in chunks of 3 for better layout
      for (let i = 0; i < cmds.length; i += 3) {
        const chunk = cmds.slice(i, i + 3);
        const commandLine = chunk.map(cmd => `• ${cmd}`).join('  │  ');
        msg += `│ ${commandLine}${' '.repeat(35 - commandLine.length)}│\n`;
      }
      
      msg += `╰${'─'.repeat(35)}╯\n\n`;
    });

    // 🎊 ULTRA PREMIUM FOOTER
    msg += `╔════════════════════════════════════╗\n`;
    msg += `📊 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦:\n`;
    msg += `├─ Total Commands: ${commands.size}\n`;
    msg += `├─ Total Categories: ${sortedCategories.length}\n`;
    msg += `├─ Prefix: ${prefix}\n`;
    msg += `├─ Version: 3.0.0 ULTRA\n`;
    msg += `╰─ Status: 🟢 ONLINE\n\n`;
    msg += `💡 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:\n`;
    msg += `├─ ${prefix}help <command> - Command details\n`;
    msg += `├─ ${prefix}help categories - Browse categories\n`;
    msg += `├─ ${prefix}help <page> - Paginated view\n`;
    msg += `╰─ ${prefix}help all - This view\n\n`;
    msg += `🚫 𝗦𝗣𝗔𝗠𝗠𝗜𝗡𝗚 𝗦𝗧𝗥𝗜𝗖𝗧𝗟𝗬 𝗣𝗥𝗢𝗛𝗜𝗕𝗜𝗧𝗘𝗗\n`;
    msg += `💎 𝗨𝗟𝗧𝗥𝗔 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗩3.0\n`;
    msg += `╚════════════════════════════════════╝`;

    return axios.get('https://apikanna.maduka9.repl.co').then(res => {
      let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
      let admID = "100022944679426";

      api.getUserInfo(parseInt(admID), (err, data) => {
        if(err) return console.log(err);
        var obj = Object.keys(data);
        var firstname = data[obj].name.replace("@", "");
        
        let callback = function () {
          api.sendMessage({ 
            body: msg,
            mentions: [{
              tag: firstname,
              id: admID,
              fromIndex: 0,
            }],
            attachment: fs.createReadStream(__dirname + `/cache/ultra_all.${ext}`)
          }, event.threadID, (err, info) => {
            fs.unlinkSync(__dirname + `/cache/ultra_all.${ext}`);
            if (autoUnsend == false) {
              setTimeout(() => { 
                return api.unsendMessage(info.messageID);
              }, delayUnsend * 1000);
            }
          }, event.messageID);
        }
        request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/ultra_all.${ext}`)).on("close", callback);
      });
    });
  };

  // 📄 PAGINATED VIEW - ULTRA ENHANCED
  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 15;
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

    // 🎨 ULTRA PREMIUM HEADER
    msg += `╔════════════════════════════════════╗\n`;
    msg += `           🎯 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 🎯\n`;
    msg += `╚════════════════════════════════════╝\n\n`;

    // 📝 COMMAND LIST WITH NUMBERING
    helpView.forEach((cmds, index) => {
      const num = first + index + 1;
      msg += `│ ${num.toString().padStart(2, '0')}. ${global.config.PREFIX}${cmds}\n`;
    });

    // 📊 ULTRA PREMIUM FOOTER
    msg += `\n╔════════════════════════════════════╗\n`;
    msg += `📄 𝗣𝗔𝗚𝗘: ${page}/${totalPages}\n`;
    msg += `📊 𝗧𝗢𝗧𝗔𝗟: ${arrayInfo.length} commands\n`;
    msg += `🔧 𝗣𝗥𝗘𝗙𝗜𝗫: ${prefix}\n`;
    msg += `╰────────────────────────────────────╯\n\n`;
    msg += `🎯 𝗡𝗔𝗩𝗜𝗚𝗔𝗧𝗜𝗢𝗡:\n`;
    msg += `├─ ${prefix}help all - Complete list\n`;
    msg += `├─ ${prefix}help categories - Browse categories\n`;
    msg += `├─ ${prefix}help <command> - Command details\n`;
    if (page < totalPages) msg += `├─ ${prefix}help ${page + 1} - Next page\n`;
    if (page > 1) msg += `├─ ${prefix}help ${page - 1} - Previous page\n`;
    msg += `╰─ ${prefix}help 1 - First page\n\n`;
    msg += `💎 𝗨𝗟𝗧𝗥𝗔 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗩3.0\n`;
    msg += `╚════════════════════════════════════╝`;

    var callback = () => api.sendMessage({ 
      body: msg, 
      attachment: fs.createReadStream(__dirname + "/cache/ultra_help.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ultra_help.jpg"), event.messageID);
    
    return request(encodeURI(ultraBackgrounds[Math.floor(Math.random() * ultraBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/ultra_help.jpg")).on("close", () => callback());
  } 

  // 🎯 SINGLE COMMAND VIEW
  const leiamname = getText("moduleInfo", command.config.name, command.config.description, `${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits);

  var callback = () => api.sendMessage({ 
    body: leiamname, 
    attachment: fs.createReadStream(__dirname + "/cache/ultra_command.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ultra_command.jpg"), event.messageID);
  
  return request(encodeURI(ultraBackgrounds[Math.floor(Math.random() * ultraBackgrounds.length)])).pipe(fs.createWriteStream(__dirname + "/cache/ultra_command.jpg")).on("close", () => callback());
};
