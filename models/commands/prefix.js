const axios = require("axios");

module.exports.config = {
  name: "prefix",
  version: "2.5",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Premium bot info card",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  // OWNER INFO
  const OWNER_UID = "61580003810694"; 
  const ownerName = "🖤 ᴀʀʏᴀɴ ᴋʜᴀɴ 🖤";
  const profileLink = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const messageLink = `https://m.me/${OWNER_UID}`;

  // BOT DATA
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const cmds = global.client.commands.size;

  const msg = `
╔════════════ 🌟 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 🌟 ════════════╗

👋 Hi ${await Users.getNameUser(event.senderID)}!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${global.config.BOTNAME}
🆔 𝗕𝗼𝘁 𝗜𝗗: ${api.getCurrentUserID()}

📍 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}
📚 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${cmds}

👥 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${totalUsers}
💬 𝗧𝗼𝘁𝗮𝗹 𝗧𝗵𝗿𝗲𝗮𝗱𝘀: ${totalThreads}

🧠 Try "/help" to see available commands!

👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${ownerName}
🔗 Facebook: ${profileLink}

╚══════════════════════════════╝

🔘 [𝗣𝗿𝗼𝗳𝗶𝗹𝗲] → ${profileLink}
💬 [𝗠𝗲𝘀𝘀𝗮𝗴𝗲] → ${messageLink}
`;

  api.sendMessage(msg, event.threadID);
};
