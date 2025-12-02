const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ARYAN",
  description: "Show bot info when someone says prefix",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

// Auto Trigger Words
const triggerWords = ["prefix", "Prefix", "PREFIX"];

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { body, threadID, senderID } = event;

  if (!body || !triggerWords.includes(body.trim())) return;

  const prefix = global.config.PREFIX;

  // OWNER DETAILS
  const ownerName = "ARYAN";
  const ownerID = "61580003810694"; // AAPKA UID
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const message = `
👋 Hi ${await Users.getNameUser(senderID)}!

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
    fs.writeFileSync(imgPath, Buffer.from(imgData.data));

    api.sendMessage({
      body: message,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath));

  } catch (e) {
    api.sendMessage("❌ Error loading profile image.", threadID);
  }
};

module.exports.run = () => {};
