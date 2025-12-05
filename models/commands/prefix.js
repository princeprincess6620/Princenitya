const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

const pathFile = __dirname + '/cache/prefix_event.txt';

if (!fs.existsSync(pathFile))
  fs.writeFileSync(pathFile, 'true');

module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "M.R ARYAN",
  description: "Prefix event trigger",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event, client }) => {

  const isEnable = fs.readFileSync(pathFile, 'utf-8');

  if (isEnable !== "true") return;

  const body = event.body ? event.body.toLowerCase().trim() : "";

  // 🔥 TRIGGER ONLY IF USER TYPES EXACT "prefix"
  if (body !== "prefix") return;

  let threadInfo = await api.getThreadInfo(event.threadID);
  let groupName = threadInfo.threadName;

  let time = moment.tz("Asia/Karachi").format("LLLL");

  const text = `—»✨[ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐄𝐯𝐞𝐧𝐭 ]✨«—
𝐍𝐀𝐌𝐄 ➢ 🍒𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓😘𝐎𝐅-𝐅𝐀𝐓𝐇𝐄𝐑🍒
𝐑𝐎𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 ➢ 「 ${global.config.PREFIX} 」
𝐑𝐎𝐁𝐎𝐓 𝐂𝐌𝐃 ➢ 「 ${client.commands.size} 」
𝐓𝐈𝐌𝐄 ➢ ${time}
𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄 ➢ ${groupName}
𝐎𝐖𝐍𝐄𝐑 ➢ 𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍`;

  const img = "https://i.ibb.co/KzGfjVt0/IMG-20251205-170113.jpg";

  const res = await axios.get(img, { responseType: 'arraybuffer' });
  const ext = path.extname(img);
  const filePath = __dirname + `/cache/prefix${ext}`;

  fs.writeFileSync(filePath, Buffer.from(res.data, 'binary'));

  api.sendMessage(
    {
      body: text,
      attachment: fs.createReadStream(filePath)
    },
    event.threadID,
    () => fs.unlinkSync(filePath),
    event.messageID
  );
};

module.exports.run = async ({ api, args, event }) => {

  try {
    if (args[0] == 'on') {
      fs.writeFileSync(pathFile, 'true');
      api.sendMessage('✅ Prefix event ON!', event.threadID, event.messageID);
    }

    else if (args[0] == 'off') {
      fs.writeFileSync(pathFile, 'false');
      api.sendMessage('❌ Prefix event OFF!', event.threadID, event.messageID);
    }

    else {
      api.sendMessage(`❗ Wrong format!\nUse: prefix on/off`, event.threadID, event.messageID);
    }
  }
  catch (e) {
    console.log(e);
  }
};
