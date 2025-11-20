const os = require("os");

module.exports.config = {
  name: "upt",
  version: "10.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra Cosmic",
  description: "Next Level Ultra Royal VIP Animated System Panel",
  commandCategory: "vip",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const tID = event.threadID;

  // =============== ANIMATION LEVEL 1: GOLD NEON STARTUP ===============
  const intro = [
`⚡✨ 𝐁𝐎𝐎𝐓𝐈𝐍𝐆 𝐔𝐋𝐓𝐑𝐀 𝐑𝐎𝐘𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌...`,
`⚡✨ 𝐁𝐎𝐎𝐓𝐈𝐍𝐆 𝐔𝐋𝐓𝐑𝐀 𝐑𝐎𝐘𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌....`,
`⚡✨ 𝐁𝐎𝐎𝐓𝐈𝐍𝐆 𝐔𝐋𝐓𝐑𝐀 𝐑𝐎𝐘𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌......`,
`⚡✨ 𝐁𝐎𝐎𝐓𝐈𝐍𝐆 𝐔𝐋𝐓𝐑𝐀 𝐑𝐎𝐘𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌..........`,
`👑 𝐒𝐘𝐒𝐓𝐄𝐌 𝐑𝐎𝐘𝐀𝐋 𝐊𝐄𝐑𝐍𝐄𝐋 𝐎𝐍𝐋𝐈𝐍𝐄...`
  ];

  for (let f of intro) {
    await api.sendMessage(f, tID);
    await new Promise(r => setTimeout(r, 350));
  }

  // =============== ANIMATION LEVEL 2: ROYAL CROWN DROP ===============
  const crown = [
`...............👑`,
`............👑`,
`.........👑`,
`......👑`,
`...👑`,
`👑`,
`👑 𝐑𝐎𝐘𝐀𝐋 𝐊𝐈𝐍𝐆 𝐌𝐎𝐃𝐄 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃`
  ];

  for (let f of crown) {
    await api.sendMessage(f, tID);
    await new Promise(r => setTimeout(r, 320));
  }

  // =============== ANIMATION LEVEL 3: SCANNING ===============
  const scanFrames = [
`🔍 Scanning System [▒▒▒▒▒▒▒▒▒] 0%`,
`🔍 Scanning System [██▒▒▒▒▒▒▒] 20%`,
`🔍 Scanning System [██████▒▒▒] 60%`,
`🔍 Scanning System [█████████] 100%`,
`💛 Scan Complete!`
  ];

  for (let f of scanFrames) {
    await api.sendMessage(f, tID);
    await new Promise(r => setTimeout(r, 280));
  }

  // =============== SYSTEM DATA ===============
  const up = process.uptime();
  const h = Math.floor(up / 3600);
  const m = Math.floor((up % 3600) / 60);
  const s = Math.floor(up % 60);

  const cpu = os.cpus()[0].model;
  const ram = (os.totalmem() / 1024 ** 3).toFixed(2);
  const free = (os.freemem() / 1024 ** 3).toFixed(2);

  // =============== FINAL ULTRA ROYAL PANEL ===============
  const final = `
╔══════════════════════════════════════╗
        👑✨ 𝐔𝐋𝐓𝐑𝐀 𝐑𝐎𝐘𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐏𝐀𝐍𝐄𝐋 ✨👑
╚══════════════════════════════════════╝

🔥 *Bot Status:* 𝙊𝙉𝙇𝙄𝙉𝙀 ✓
👑 *Royal Mode:* 𝐊𝐈𝐍𝐆 𝐆𝐎𝐋𝐃 𝐀𝐂𝐓𝐈𝐕𝐄  
💠 *Access:* 𝐇𝐘𝐏𝐄𝐑 𝐑𝐎𝐘𝐀𝐋 𝐏𝐑𝐈𝐌𝐄

┏━━━━━━━ 👑 𝐒𝐘𝐒𝐓𝐄𝐌 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 👑 ━━━━━━━┓
⚙ CPU       : ${cpu}
💾 RAM       : ${free}GB / ${ram}GB
⏱ Uptime    : ${h}h ${m}m ${s}s
🌐 Platform  : ${os.platform().toUpperCase()}
🖥 Device    : ${os.hostname()}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👑 Powered By: *Ultra Royal Engine 10.0*
🔰 Owner: *${event.senderID}*
✨ Ready For Supreme Level Commands!
`;

  api.sendMessage(final, tID);
};
