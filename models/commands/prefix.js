const fs = require("fs");

module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show Bot Information With FB Owner Card",
  commandCategory: "System",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args, Users }) => {
  const fbUrl = "https://www.facebook.com/profile.php?id=61580003810694"; // your profile

  const msg = `
━━━━━━━━━━━━━━━━━━━━━━
🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
━━━━━━━━━━━━━━━━━━━━━━

👋 Hi, Welcome To 𝑨𝑹𝒀𝑨𝑵 𝗕𝗼𝘁 ✨

🤖 Bot Name: FB Bot
🆔 Bot ID: ${api.getCurrentUserID()}

📍 Prefix: .
📚 Commands: 141

👥 Total Users: 7067
💬 Total Threads: 56

💡 Type: .help for all commands

👑 Bot Owner:
👇 Tap below to view profile
`;

  api.sendMessage(msg, event.threadID, () => {
    api.sendMessage({ url: fbUrl }, event.threadID); // URL PREVIEW AUTO CARD
  });
};
