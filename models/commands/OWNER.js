const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "32.0.0 STABLE ULTRA",
  hasPermssion: 0,
  credits: "ARYAN XD | NEXT GEN",
  description: "Royal Owner Card Stable Version",
  commandCategory: "System",
  usages: "owner",
  cooldowns: 3,
};

const cooldown = new Map();

// ✔ 100% WORKING RAW IMAGE (not blocked anywhere)
const premiumImage = "https://raw.githubusercontent.com/aryan-premium/ultra-images/main/royal-gold-card.png";

async function sendRoyalCard(api, event, isCommand = false) {
  const user = event.senderID;
  const now = Date.now();

  if (cooldown.has(user) && now - cooldown.get(user) < 7000) {
    if (isCommand) {
      const wait = Math.ceil((7000 - (now - cooldown.get(user))) / 1000);
      api.sendMessage(`⏳ *Wait:* ${wait}s`, event.threadID);
    }
    return;
  }

  cooldown.set(user, now);

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const imgPath = path.join(cacheDir, `royal_${Date.now()}.png`);

  try {
    const response = await axios.get(premiumImage, {
      responseType: "arraybuffer",
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    fs.writeFileSync(imgPath, Buffer.from(response.data));

    const message = {
      body:
`╔══✦•⚜•✦══╗
   👑 ROYAL OWNER CARD 👑
╚══✦•⚜•✦══╝

✨ *Owner:* ARYAN XD NITYA
🤖 *Bot:* ARYAN BOT ULTRA NEXT GEN
💠 *Rank:* GOD MODE
🚀 *Speed:* 9999x AI Boost
💎 *Support:* Lifetime VIP

✈ Telegram: t.me/Aryanchat4322
💻 Github: Aryan1435
⚡ Respect The Royal System ⚡`,
      attachment: fs.createReadStream(imgPath)
    };

    const sent = await api.sendMessage(message, event.threadID);

    const react = ["👑", "⚡", "💎", "🔥", "✨"];
    for (const r of react) {
      await new Promise(res => setTimeout(res, 300));
      await api.setMessageReaction(r, sent.messageID, () => {}, true);
    }

    setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 6000);

  } catch (err) {
    api.sendMessage("❌ Royal Card Load Problem.\nTry again: !owner", event.threadID);
    console.log("OWNER CARD ERROR:", err);
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  const text = event.body?.toLowerCase() || "";
  const keys = ["owner", "aryan", "boss", "vip", "king", "premium"];

  if (keys.some(k => text.includes(k))) sendRoyalCard(api, event, false);
};

module.exports.run = async ({ api, event }) => {
  sendRoyalCard(api, event, true);
};
