const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot information",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {
  const prefix = global.config.PREFIX;

  // OWNER INFO
  const OWNER_UID = "61580003810694";
  const ownerName = "ARYAN";
  const fbLink = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const inboxLink = `https://m.me/${OWNER_UID}`;

  // BOT DATA
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const messageText = `
━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}

👤 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Bot Owner: ${ownerName}

🌐 Profile: ${fbLink}
💬 Message: ${inboxLink}

━━━━━━━━━━━━━━━━━━
📞 Sending Owner Contact...
━━━━━━━━━━━━━━━━━━
`;

  // 1️⃣ First send bot info text
  api.sendMessage(messageText, event.threadID, async () => {
    // 2️⃣ Then send owner contact card
    return api.shareContact(
      `📞 Contact Owner: ${ownerName}`,
      OWNER_UID,
      event.threadID,
      async (err, info) => {
        if (err) return console.log(err);

        // 3️⃣ Auto Unsend the contact card after 5 seconds
        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 5000);
      }
    );
  });
};
