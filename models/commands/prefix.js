const axios = require("axios");

module.exports.config = {
  name: "prefix",
  version: "3.5",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Bot information with FB contact card",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  const OWNER_UID = "61580003810694";
  const ownerName = "🌹『 𝑨𝑹𝒀𝑨𝑵 』🌹";

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const cmds = global.client.commands.size;

  const text = `
┏━━━━━━━🌟 BOT INFORMATION 🌟━━━━━━┓

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

📍 Prefix: ${prefix}
📚 Commands: ${cmds}

👥 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Bot Owner:
`;

  api.sendMessage(text, event.threadID, () => {

    // Contact preview link
    api.sendMessage({
      body: `✨ ${ownerName}\n📍 Facebook`,
      attachment: null,
      url: `https://www.facebook.com/profile.php?id=${OWNER_UID}` // for card preview
    }, event.threadID, () => {

      // Contact card generator
      api.shareContact(
        ownerName,
        OWNER_UID,
        event.threadID,
        (err, info) => {
          if (err) return console.log(err);

          setTimeout(() => api.unsendMessage(info.messageID), 20000);
        }
      );
    });
  });
};
