const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "31.0.0 NEXT LEVEL FIXED",
  hasPermssion: 0,
  credits: "ARYAN XD | ULTRA NEXT GEN",
  description: "LEGENDARY OWNER CARD GLOW DESIGN FIXED",
  commandCategory: "System",
  usages: "owner",
  cooldowns: 3,
};

const cooldown = new Map();

// ⚡ NEW Working Ultra ImgBB Link
const premiumImage = "https://i.ibb.co/2329JM2X/IMG-20251127-184500.png";

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
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const imgPath = path.join(cacheDir, `royal_${Date.now()}.jpg`);

  try {
    const { data } = await axios.get(premiumImage, {
      responseType: "arraybuffer",
      timeout: 8000
    });

    fs.writeFileSync(imgPath, Buffer.from(data));

    const message = {
      body:
`╭━━━━━━━━━━━━━━✦⚜✦━━━━━━━━━━━━━━╮
        👑 *ROYAL OWNER CARD*
╰━━━━━━━━━━━━━━✦⚜✦━━━━━━━━━━━━━━╯

✨ *Owner:* 𝗔𝗥𝗬𝗔𝗡 𝗫𝗗 𝗡𝗜𝗧𝗬𝗔
🤖 *Bot:* 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗨𝗟𝗧𝗥𝗔 𝗡𝗘𝗫𝗧 𝗚𝗘𝗡
💠 *Rank:* 𝗚𝗢𝗗 𝗟𝗘𝗩𝗘𝗟 𝗣𝗢𝗪𝗘𝗥
⚡ *Core:* Quantum AI Boost Engine
💎 *Support:* Lifetime VIP

✈ Telegram: t.me/Aryanchat4322
💻 GitHub: Aryan1435
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Respect The Owner • Love The System ⚡`,
      attachment: fs.createReadStream(imgPath)
    };

    const sent = await api.sendMessage(message, event.threadID);

    const animated = ["👑", "🔥", "💎", "⚡", "✨", "🚀"];
    for (const r of animated) {
      await new Promise(res => setTimeout(res, 300));
      await api.setMessageReaction(r, sent.messageID, () => {}, true);
    }

    setTimeout(() => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, 6000);

  } catch (error) {
    api.sendMessage(`⚠️ Image Load Failed.\nTry: !owner again`, event.threadID);
    console.log("Royal Card Error:", error);
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  const text = event.body?.toLowerCase() || "";
  const keys = ["owner", "malik", "vip", "premium", "boss"];

  if (keys.some(k => text.includes(k))) {
    sendRoyalCard(api, event, false);
  }
};

module.exports.run = async ({ api, event }) => {
  sendRoyalCard(api, event, true);
};
