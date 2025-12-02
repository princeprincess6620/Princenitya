const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Premium Bot Info Card",
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
  const ownerName = "ARYAN 💛";          // apna naam daalo
  const ownerID = "61580003810694";      // apna UID daalo
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;

  // BOT DATA
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const msg = `╭───────────────╮
      『 BOT INFORMATION 』
╰───────────────╯

👋 Hi ${await Users.getNameUser(senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}

👤 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Bot Owner: ${ownerName}
`;

  try {
    const imgPath = path.join(__dirname, "/owner.jpg");
    const imgData = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgData.data));

    api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(imgPath),
      mentions: [{ tag: ownerName, id: ownerID }]
    }, threadID, async (err, info) => {
      if (err) return;

      // BUTTON STYLE
      api.sendMessage({
        body: "👇 Tap Button",
        attachment: null,
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
      }, threadID);

      fs.unlinkSync(imgPath);
    });

  } catch (e) {
    api.sendMessage("❌ Error loading owner profile.", threadID);
  }
};

module.exports.run = () => {};
