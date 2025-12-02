const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot information with owner card UI",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  // Owner Details
  const OWNER_UID = "61580003810694";
  const ownerName = "ARYAN";
  const fbProfile = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const msgLink = `https://m.me/${OWNER_UID}`;

  const avatarUrl = `https://graph.facebook.com/${OWNER_UID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const imgPath = path.join(__dirname, `/cache/avatar_${OWNER_UID}.png`);

  // Download owner avatar
  const imgData = await axios.get(avatarUrl, { responseType: "arraybuffer" });
  fs.writeFileSync(imgPath, Buffer.from(imgData.data, "utf-8"));

  const content = `
╔════❰ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 ❱════╗
👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}
🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}
👤 Total Users: ${global.data.allUserID.length}
💬 Total Threads: ${global.data.allThreadID.length}

👑 Bot Owner: ${ownerName}
╚════════════════════════╝
🔻 Owner Card Below 🔻
`;

  api.sendMessage(content, event.threadID, async () => {

    const card = {
      body: `👑 ${ownerName} — Facebook Owner`,
      attachment: fs.createReadStream(imgPath),
      buttons: [
        {
          type: "web_url",
          url: fbProfile,
          title: "🌐 Profile"
        },
        {
          type: "web_url",
          url: msgLink,
          title: "💬 Message"
        }
      ]
    };

    api.sendMessage(card, event.threadID, event.messageID, () => {
      fs.unlinkSync(imgPath); // delete cache image
    });

  });
};
