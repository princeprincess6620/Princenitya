const os = require("os");

module.exports.config = {
  name: "upt",
  version: "8.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra Cosmic Gold Edition",
  description: "VIP Ultra Plus Gold Animated System Panel",
  commandCategory: "vip",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const threadID = event.threadID;

  // GOLD ANIMATION FRAMES
  const frames = [
`✨👑 𝐆𝐎𝐋𝐃 𝐌𝐎𝐃𝐄 𝐈𝐍𝐈𝐓𝐈𝐀𝐋𝐈𝐙𝐈𝐍𝐆... 👑✨`,
`✨👑 𝐆𝐎𝐋𝐃 𝐌𝐎𝐃𝐄 𝐈𝐍𝐈𝐓𝐈𝐀𝐋𝐈𝐙𝐈𝐍𝐆.. 👑✨`,
`✨👑 𝐆𝐎𝐋𝐃 𝐌𝐎𝐃𝐄 𝐈𝐍𝐈𝐓𝐈𝐀𝐋𝐈𝐙𝐈𝐍𝐆. 👑✨`,
`✨👑 𝐆𝐎𝐋𝐃 𝐌𝐎𝐃𝐄 𝐈𝐍𝐈𝐓𝐈𝐀𝐋𝐈𝐙𝐈𝐍𝐆... 👑✨`,
`💛💎 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐢𝐧𝐠 𝐆𝐨𝐥𝐝 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐌𝐨𝐝𝐮𝐥𝐞𝐬... 💎💛`,
`💛💎 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐢𝐧𝐠 𝐆𝐨𝐥𝐝 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐌𝐨𝐝𝐮𝐥𝐞𝐬.. 💎💛`,
`💛💎 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐢𝐧𝐠 𝐆𝐨𝐥𝐝 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐌𝐨𝐝𝐮𝐥𝐞𝐬. 💎💛`,
`👑✨ 𝐔𝐧𝐥𝐨𝐜𝐤𝐢𝐧𝐠 𝐆𝐎𝐋𝐃 𝐕𝐈𝐏 𝐏𝐀𝐍𝐄𝐋... ✨👑`
  ];

  // Play animation
  for (let frame of frames) {
    await api.sendMessage(frame, threadID);
    await new Promise(res => setTimeout(res, 500));
  }

  // SYSTEM DATA
  const uptime = process.uptime();
  const hrs = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);

  const cpu = os.cpus()[0].model;
  const ram = (os.totalmem() / 1024 ** 3).toFixed(2);
  const free = (os.freemem() / 1024 ** 3).toFixed(2);

  // FINAL GOLD PANEL
  const finalPanel = `
╔══════════════════════════════╗
      👑💛 𝐕𝐈𝐏 𝐆𝐎𝐋𝐃 𝐏𝐀𝐍𝐄𝐋 💛👑
╚══════════════════════════════╝

✨ *Status:* 𝙊𝙉𝙇𝙄𝙉𝙀 ✔  
👑 *Mode:* 𝐆𝐎𝐋𝐃 𝐑𝐎𝐘𝐀𝐋 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃  
💠 *Access:* 𝐔𝐋𝐓𝐑𝐀 𝐆𝐎𝐋𝐃 𝐏𝐑𝐈𝐌𝐄

┏━━━ 💛 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎 💛 ━━━┓
⚙ CPU: ${cpu}
💾 RAM: ${free}GB / ${ram}GB
⏱ Uptime: ${hrs}h ${mins}m ${secs}s
🌐 Platform: ${os.platform().toUpperCase()}
┗━━━━━━━━━━━━━━━━━━━━━━┛

👑 Powered By: *Gold Elite Engine*
🔰 Owner: *${event.senderID}*
💛 Ready for Royal Commands!
`;

  api.sendMessage(finalPanel, threadID);
};
