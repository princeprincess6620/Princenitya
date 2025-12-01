const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot information card",
  commandCategory: "system",
  usages: "",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const prefix = global.config.PREFIX;
  const threadInfo = await api.getThreadInfo(event.threadID);
  const userCount = threadInfo.participantIDs.length;

  // OWNER DETAILS (Your FB Profile)
  const ownerName = "ARYAN";
  const fbID = "61580003810694";  
  const fbProfileLink = `https://www.facebook.com/profile.php?id=${fbID}`;
  const avatarURL = `https://graph.facebook.com/${fbID}/picture?width=720&height=720`;

  const msg = `
━━━━━━━━━━━━━━━━━━
   🔱  𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍  🔱
━━━━━━━━━━━━━━━━━━

👋 Hi User!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}
🔧 Prefix: ${prefix}

📚 Commands: ${global.client.commands.size}
👤 Total Users: ${global.data.allUserID.length}
💬 Total Threads: ${global.data.allThreadID.length}

💡 Try: ${prefix}help
🪄 Powered By: ${ownerName}

━━━━━━━━━━━━━━━━━━
👑 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑
`;

  try {
    const imgPath = path.join(__dirname, 'owner.jpg');
    const imgData = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(imgPath, Buffer.from(imgData, "utf-8"));

    api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(imgPath),
      mentions: [{ id: event.senderID, tag: ownerName }],
      buttons: [
        {
          type: "web_url",
          url: fbProfileLink,
          title: "🌐 Profile"
        },
        {
          type: "web_url",
          url: `https://m.me/${fbID}`,
          title: "💬 Message"
        }
      ]
    }, event.threadID, () => fs.unlinkSync(imgPath));

  } catch (e) {
    api.sendMessage("❌ Error loading profile image", event.threadID);
  }
};
