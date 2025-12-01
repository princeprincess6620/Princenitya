const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "prefix",
  version: "1.0.9",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot info only typing prefix",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  // Owner Info
  const OWNER_UID = "61580003810694"; // Your ID
  const ownerName = "ARYAN";          // Your Name
  const fbLink = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const messageLink = `https://m.me/${OWNER_UID}`;

  // Bot Data
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const cmds = global.client.commands.size;

  const text = `
╔═══❖•🌟 BOT INFORMATION 🌟•❖═══╗

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}
🔧 Prefix: ${prefix}
📚 Commands: ${cmds}

👥 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Owner: ${ownerName}
🆔 UID: ${OWNER_UID}

🌐 Facebook: ${fbLink}
💬 Message: ${messageLink}

╚════════════════════╝
📞 Sending contact...`;

  api.sendMessage(text, event.threadID, async () => {
    api.shareContact(
      `👑 Owner: ${ownerName}`,
      OWNER_UID,
      event.threadID,
      (err, res) => {
        if (err) return console.log(err);

        setTimeout(() => {
          api.unsendMessage(res.messageID);
        }, 5000);
      }
    );
  });
};
