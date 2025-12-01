const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot information",
  commandCategory: "system",
  usages: "",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {

  const prefix = global.config.PREFIX;

  const ownerName = "ARYAN";
  const fbID = "61580003810694";
  const fbProfileLink = `https://www.facebook.com/profile.php?id=${fbID}`;
  const avatarURL = `https://graph.facebook.com/${fbID}/picture?width=720&height=720`;

  const msg = `
━━━━━━━━━━━━━━━━━━
🔱  𝐁𝐎𝐓 𝐈𝐍𝐅𝐎  🔱
━━━━━━━━━━━━━━━━━━

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}
🔧 Prefix: ${prefix}

📚 Commands: ${global.client.commands.size}
👤 Users: ${global.data.allUserID.length}
💬 Threads: ${global.data.allThreadID.length}

👑 Owner: ${ownerName}

🔗 Facebook: ${fbProfileLink}
━━━━━━━━━━━━━━━━━━`;

  try {
    const imgPath = path.join(__dirname, "owner.jpg");
    const imgData = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;

    fs.writeFileSync(imgPath, Buffer.from(imgData, "utf-8"));

    api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));

  } catch (e) {
    api.sendMessage("❌ Profile Image Load Error", event.threadID);
  }
};
