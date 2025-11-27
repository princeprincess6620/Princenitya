const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "30.0.0 NEXT LEVEL",
  hasPermssion: 0,
  credits: "ARYAN XD | ULTRA NEXT GEN",
  description: "LEGENDARY OWNER CARD GLOW DESIGN",
  commandCategory: "System",
  usages: "owner",
  cooldowns: 3,
};

const cooldown = new Map();

// 🖼 SINGLE PREMIUM ImgBB LINK (Ultra 4K Gold Frame Owner Card)
const premiumImage = "https://i.ibb.co/7zTzc6J/ultra-royal-gold.jpg";

async function sendRoyalCard(api, event, isCommand = false) {
  const user = event.senderID;
  const now = Date.now();

  if (cooldown.has(user) && now - cooldown.get(user) < 7000) {
    if (isCommand) {
      const wait = Math.ceil((7000 - (now - cooldown.get(user))) / 1000);
      api.sendMessage(`⏳ *Royal Access Wait:* ${wait}s`, event.threadID);
    }
    return;
  }

  cooldown.set(user, now);

  const cacheDir = path.join(__dirname, "cache");
  const imgPath = path.join(cacheDir, `royal_${Date.now()}.png`);
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  try {
    const response = await axios.get(premiumImage, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(response.data));

    const msg = {
      body:
`╭━━━━━━━━━━━━━━✦⚜✦━━━━━━━━━━━━━━╮
              👑 *ROYAL OWNER CARD*
╰━━━━━━━━━━━━━━✦⚜✦━━━━━━━━━━━━━━╯

✨ *Owner:* 𝗔𝗥𝗬𝗔𝗡 𝗫𝗗 𝗡𝗜𝗧𝗬𝗔
🤖 *Bot:* 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗨𝗟𝗧𝗥𝗔 𝗡𝗘𝗫𝗧 𝗚𝗘𝗡
💠 *Rank:* 𝗚𝗢𝗗 𝗟𝗘𝗩𝗘𝗟 𝗣𝗢𝗪𝗘𝗥
⚡ *Core:* Quantum AI Boost Engine
🛡 *Mode:* Royal Protection Security
💎 *Support:* Lifetime VIP Premium

🌍 *Network:* Global Ultra Fast Server
✈️ Telegram: t.me/Aryanchat4322
💻 GitHub: Aryan1435

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 *Respect The Owner • Love The System* 🔥
💫 *Power Starts Here*
`,
      attachment: fs.createReadStream(imgPath),
    };

    const sent = await api.sendMessage(msg, event.threadID);

    // Animated Reaction Effect (wave style)
    const reactionWave = ["👑", "⚡", "💎", "🔥", "✨", "🔱", "🚀"];
    for (let r of reactionWave) {
      await new Promise((res) => setTimeout(res, 320));
      await api.setMessageReaction(r, sent.messageID, () => {}, true);
    }

    setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 6000);

  } catch (err) {
    api.sendMessage("❌ Royal Card Load Error! Try again.", event.threadID);
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  const text = event.body?.toLowerCase() || "";
  const keys = ["owner", "arya", "aryan", "vip", "premium", "king", "boss"];

  if (keys.some((k) => text.includes(k))) {
    sendRoyalCard(api, event, false);
  }
};

module.exports.run = async ({ api, event }) => {
  sendRoyalCard(api, event, true);
};
