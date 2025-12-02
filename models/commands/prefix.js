const axios = require("axios");

module.exports.config = {
  name: "prefix",
  version: "3.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot info + contact card",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  // OWNER INFO
  const OWNER_UID = "61580003810694";
  const ownerName = "🍒 ᴀʀʏᴀɴ ʙᴏᴛ ғᴀᴛʜᴇʀ 🍒";

  // BOT DATA
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const cmds = global.client.commands.size;

  const message = `
✧༺🌟 BOT INFORMATION 🌟༻✧

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

📍 Prefix: ${prefix}
📚 Commands: ${cmds}

👥 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Owner: ${ownerName}
🆔 UID: ${OWNER_UID}

🌐 Facebook: https://www.facebook.com/profile.php?id=${OWNER_UID}
💬 Message: https://m.me/${OWNER_UID}

━━━━━━━━━━━━━━━━━━
📞 Sending contact card...
`;

  api.sendMessage(message, event.threadID, async () => {
    api.shareContact(
      ownerName,
      OWNER_UID,
      event.threadID,
      (error, info) => {
        if (error) return console.log(error);
        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 15000); // wait 15s so card load fully
      }
    );
  });
};
