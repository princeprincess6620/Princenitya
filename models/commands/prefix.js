const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show Premium Owner Card",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

const triggerWords = ["prefix", "Prefix", "PREFIX"];

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { body, threadID, senderID } = event;
  if (!body || !triggerWords.includes(body.trim())) return;

  const prefix = global.config.PREFIX;

  // OWNER INFO
  const ownerName = "ARYAN 💛";
  const ownerID = "61580003810694";
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=800&height=800`;
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;

  // BOT STATS
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const message = `『 BOT INFORMATION 』

👋 Hi Facebook users!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}

🧍 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Bot Owner:
━━━━━━━━━━━━━━━━━━`;

  try {
    const imgPath = path.join(__dirname, "owner.jpg");
    const imgData = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgData.data));

    // First message with bot info
    api.sendMessage(message, threadID, async () => {

      // Second message with DP + buttons like screenshot
      api.sendMessage({
        body: `✨ ${ownerName}\nFacebook`,
        attachment: fs.createReadStream(imgPath),
        buttons: [
          {
            url: fbLink,
            title: "🌐 Profile"
          },
          {
            url: inboxLink,
            title: "💬 Message"
          }
        ]
      }, threadID, () => fs.unlinkSync(imgPath));

    });

  } catch (err) {
    api.sendMessage("❌ Error loading owner profile image.", threadID);
  }
};

module.exports.run = () => {};
