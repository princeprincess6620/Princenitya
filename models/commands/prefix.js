const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Bot Info Card",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

const triggerWords = ["prefix", "Prefix", "PREFIX"];

module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { body, threadID } = event;
    if (!body || !triggerWords.includes(body.trim())) return;

    const prefix = global.config.PREFIX;

    // Your Facebook Info
    const ownerID = "61580003810694"; 
    const ownerName = "ᴀʀʏᴀɴ 💛";
    const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
    const inboxLink = `https://m.me/${ownerID}`;
    const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;

    // Download Avatar
    const imgPath = path.join(__dirname, "ownerAvatar.png");
    const img = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(imgPath, Buffer.from(img, "utf-8"));

    const card =
      "╭─━━━━━【 *BOT INFORMATION* 】━━━━─╮\n" +
      `👋 Hi User!\n\n` +
      `🤖 *Bot Prefix:* ${prefix}\n` +
      `📦 *Commands:* ${global.client.commands.size}\n\n` +
      `👑 *Bot Owner:*\n` +
      `${ownerName}\n` +
      `📎 FB Profile:\n${fbLink}\n` +
      "╰─━━━━━━━━━━━━━━━━━━━━━━─╯";

    api.sendMessage(
      {
        body: card,
        attachment: fs.createReadStream(imgPath),
        mentions: [{ tag: ownerName, id: ownerID }],
        buttons: [
          { type: "web_url", url: fbLink, title: "🌐 Profile" },
          { type: "web_url", url: inboxLink, title: "💬 Message" }
        ]
      },
      threadID,
      () => fs.unlinkSync(imgPath)
    );

  } catch (error) {
    console.log(error);
  }
};

// Required to enable handleEvent in Mirai
module.exports.run = async () => {};
