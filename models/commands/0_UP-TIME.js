const os = require("os");

module.exports.config = {
  name: "upt",
  version: "10.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra Cosmic",
  description: "Ultra Royal Uptime Panel",
  commandCategory: "vip",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {

  // Uptime format
  const up = process.uptime();
  const h = Math.floor(up / 3600);
  const m = Math.floor((up % 3600) / 60);
  const s = Math.floor(up % 60);

  // System info
  const cpu = os.cpus()[0].model;
  const ramTotal = (os.totalmem() / 1024 ** 3).toFixed(2);
  const ramFree = (os.freemem() / 1024 ** 3).toFixed(2);
  const platform = os.platform().toUpperCase();
  const device = os.hostname();

  const msg = `
╔══════════════════════════════════════╗
        👑✨ 𝐔𝐋𝐓𝐑𝐀 𝐑𝐎𝐘𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐏𝐀𝐍𝐄𝐋 ✨👑
╚══════════════════════════════════════╝

🔥 *Bot Status:* 𝙊𝙉𝙇𝙄𝙉𝙀 ✓
👑 *Royal Mode:* 𝐊𝐈𝐍𝐆 𝐆𝐎𝐋𝐃 𝐀𝐂𝐓𝐈𝐕𝐄  
💠 *Access:* 𝐇𝐘𝐏𝐄𝐑 𝐑𝐎𝐘𝐀𝐋 𝐏𝐑𝐈𝐌𝐄

┏━━━━━━━ 👑 𝐒𝐘𝐒𝐓𝐄𝐌 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 👑 ━━━━━━━┓
⚙ CPU       : ${cpu}
💾 RAM       : ${ramFree}GB / ${ramTotal}GB
⏱ Uptime    : ${h}h ${m}m ${s}s
🌐 Platform  : ${platform}
🖥 Device    : ${device}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👑 Powered By: *Ultra Royal Engine 10.0*
🔰 Owner: *${event.senderID}*
✨ Ready For Supreme Level Commands!
`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
