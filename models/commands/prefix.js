const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Bot info card with owner profile",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

const triggerWords = ["prefix", "Prefix", "PREFIX"];

module.exports.handleEvent = async ({ api, event }) => {
  const { body, threadID, senderID } = event;
  if (!body || !triggerWords.includes(body.trim())) return;

  // CONFIG
  const prefix = global.config.PREFIX;
  const ownerID = "61580003810694"; // Your FB ID
  const ownerName = "ᴀʀʏᴀɴ 💛";
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;

  // Download Owner Avatar
  const imgPath = path.join(__dirname, "ownerAvatar.png");
  const getImage = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(imgPath, Buffer.from(getImage, "utf-8"));

  // BOT CARD MESSAGE
  const messageText =
    "╭─━━━━━【 *BOT INFORMATION* 】━━━━─╮\n" +
    `👋 Hi User!\n\n` +
    `🤖 *Bot Prefix:* ${prefix}\n` +
    `🧾 *Commands:* ${global.client.commands.size}\n\n` +
    `👑 *Bot Owner:*\n` +
    `${ownerName}\n` +
    `FB PROFILE ↓\n${fbLink}\n` +
    "╰─━━━━━━━━━━━━━━━━━━━━━━─╯";

  // BUTTONS
  const buttons = [
    {
      type: "web_url",
      url: fbLink,
      title: "🌐 Profile"
    },
    {
      type: "web_url",
      url: inboxLink,
      title: "💬 Message"
    }
  ];

  // SEND
  api.sendMessage({
    body: messageText,
    attachment: fs.createReadStream(imgPath),
    mentions: [{ tag: ownerName, id: ownerID }],
    buttons
  }, threadID, () => fs.unlinkSync(imgPath)); // Auto delete avatar cache
};

module.exports.run = async () => {};
