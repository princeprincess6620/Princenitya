const dipto = require('axios');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

const pathFile = __dirname + '/cache/d1p.txt';

if (!fs.existsSync(pathFile))
  fs.writeFileSync(pathFile, 'true');

const isEnable = fs.readFileSync(pathFile, 'utf-8');

module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAAN + ChatGPT",
  description: "Prefix info event",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event }) => {

  if (isEnable == "true") {

    const dipto2 = event.body ? event.body.toLowerCase() : '';

    let d1PInfo = await api.getThreadInfo(event.threadID);
    let diptoName = d1PInfo.threadName;

    var time = moment.tz("Asia/Karachi").format("LLLL");

    const text = `—»✨[ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐄𝐯𝐞𝐧𝐭 ]✨«—  
𝐍𝐀𝐌𝐄 ➢ 🍒𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓😘𝐎𝐅-𝐅𝐀𝐓𝐇𝐄𝐑🍒  
𝐑𝐎𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 ➢ 「 ${global.config.PREFIX} 」  
𝐑𝐎𝐁𝐎𝐓 𝐂𝐌𝐃 ➢ 「 ${client.commands.size} 」  
𝐓𝐈𝐌𝐄 ➢ ${time}  
𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄 ➢ ${diptoName}  
𝐎𝐖𝐍𝐄𝐑 ➢ 𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍  
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍`;

    const imgur = [
      "https://i.ibb.co/KzGfjVt0/IMG-20251205-170113.jpg"
    ];

    const link = imgur[Math.floor(Math.random() * imgur.length)];
    const res = await dipto.get(link, { responseType: 'arraybuffer' });

    const ex = path.extname(link);
    const filename = __dirname + `/cache/prefix${ex}`;

    fs.writeFileSync(filename, Buffer.from(res.data, 'binary'));

    // 🔥 TRIGGER: when user types "prefix"
    if (dipto2.indexOf("prefix") === 0) {
      api.sendMessage(
        {
          body: `${text}`,
          attachment: fs.createReadStream(filename)
        },
        event.threadID,
        () => fs.unlinkSync(filename),
        event.messageID
      );
    }
  }
};

module.exports.run = async ({ api, args, event }) => {

  try {
    if (args[0] == 'on') {
      fs.writeFileSync(pathFile, 'true');
      api.sendMessage('Prefix event ON successfully!', event.threadID, event.messageID);
    }

    else if (args[0] == 'off') {
      fs.writeFileSync(pathFile, 'false');
      api.sendMessage('Prefix event OFF successfully!', event.threadID, event.messageID);
    }

    else if (!args[0]) {
      api.sendMessage(`❌ Format wrong!\nUse: prefix on/off`, event.threadID, event.messageID);
    }
  }
  catch (e) {
    console.log(e);
  }
};
