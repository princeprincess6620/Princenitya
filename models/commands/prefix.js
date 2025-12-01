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
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {
  const prefix = global.config.PREFIX;

  const ownerName = "ARYAN";
  const ownerID = "61580003810694";
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const message = `
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
`;

  try {
    const imgPath = path.join(__dirname, "/owner.jpg");
    const imgData = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgData.data, "utf-8"));

    api.sendMessage({
      body: message,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));

  } catch (e) {
    api.sendMessage("❌ Error loading profile image.", event.threadID);
  }
};
