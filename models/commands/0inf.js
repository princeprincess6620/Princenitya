module.exports.config = {
  name: "info",
  version: "10.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra — Cyber Oni Edition",
  description: "Cyber Oni Ultra Compact Info Panel",
  commandCategory: "system",
  cooldowns: 1,
  dependencies: { "request":"", "fs-extra":"", "moment-timezone":"" }
};

module.exports.run = async function({ api, event }) {

  const rq = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  // ⚡ UPTIME
  const t = process.uptime(), h = (t/3600)|0, m = (t%3600/60)|0, s = (t%60)|0;

  // 🌍 TIME ZONES
  const inT = moment.tz("Asia/Kolkata").format("DD MMM | hh:mm A");
  const jpT = moment.tz("Asia/Tokyo").format("DD MMM | hh:mm A");

  // 📌 THREAD DATA
  const info = await api.getThreadInfo(event.threadID);

  const total = info.participantIDs.length;
  const male = info.userInfo.filter(u=>u.gender=="MALE").length;
  const female = info.userInfo.filter(u=>u.gender=="FEMALE").length;

  const msgs = info.messageCount || "N/A";

  const admins = info.adminIDs
    .map(a => info.userInfo.find(u => u.id==a.id))
    .filter(Boolean)
    .map(u=>`• ${u.name}`).join("\n") || "N/A";

  const seen = info.seenBy?.slice(0,8).map(v=>`• ${v.name}`).join("\n") || "N/A";

  const active = info.messageSenderStats?.slice(0,8)
    .map(u=>`• ${u.name} — ${u.count}`).join("\n") || "N/A";

  // 🔥 Ultra Minimalist Cyber Oni Images
  const imgs = [
    "https://i.imgur.com/qM6gjCL.jpeg",
    "https://i.imgur.com/de4dJk8.jpeg",
    "https://i.imgur.com/sRsBpZT.jpeg",
    "https://i.ibb.co/S7JtZph/cyber-oni-1.jpg",
    "https://i.ibb.co/JQvJ2kX/cyber-oni-2.jpg"
  ];

  const img = imgs[Math.random()*imgs.length|0];
  const path = __dirname + "/cache/oni.jpg";

  rq(img).pipe(fs.createWriteStream(path)).on("close", () => {

    api.sendMessage({
      body:
`⚡👹 **ＣＹＢＥＲ  ＯＮＩ — ＣＯＲＥ ＰＡＮＥＬ** 👹⚡
━━━━━━━━━━━━━━

💠 Bot: ${global.config.BOTNAME}
👑 Owner: LEGEND ARYAN
✨ Prefix: ${global.config.PREFIX}

🕰 India: ${inT}
🗼 Tokyo: ${jpT}
⚡ Uptime: ${h}h ${m}m ${s}s

━━━━━━━━━━━━━━
👥 **Group Stats**
• Total: ${total}
• Boys: ${male} | Girls: ${female}
• Messages: ${msgs}

━━━━━━━━━━━━━━
🛡 **Admins**
${admins}

━━━━━━━━━━━━━━
👀 **Recent Viewers**
${seen}

━━━━━━━━━━━━━━
🔥 **Active Users**
${active}

━━━━━━━━━━━━━━
💬 *"In Neon silence… the Oni watches everything."*
━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path));

  });
};
