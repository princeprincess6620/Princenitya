const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot info + owner contact",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  // Owner Info
  const OWNER_UID = "61580003810694"; // <-- Your UID
  const ownerName = "ARYAN";          // <-- Your Name
  const fbLink = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const messageLink = `https://m.me/${OWNER_UID}`;

  // Bot Data
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const cmds = global.client.commands.size;

  const bodyText = `
╔═══❖•🌟 BOT INFORMATION 🌟•❖═══╗

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

📍 Prefix: ${prefix}
📚 Commands: ${cmds}

👥 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Owner: ${ownerName}
🆔 UID: ${OWNER_UID}

🌐 Facebook: ${fbLink}
💬 Message: ${messageLink}

╚════════════════════╝
📞 Sending contact card...`;

  api.sendMessage(bodyText, event.threadID, async () => {
    api.shareContact(
      `👑 Owner: ${ownerName}`,
      OWNER_UID,
      event.threadID,
      (err, res) => {
        if (err) return console.log("Contact Send Error:", err);

        // Auto delete contact card after 5s
        setTimeout(() => {
          api.unsendMessage(res.messageID);
        }, 5000);
      }
    );
  });
};
