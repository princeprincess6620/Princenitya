const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "ARUN + ULTRA PREMIUM",
  description: "ULTRA OWNER CARD",
  commandCategory: "system",
  usages: "owner",
  cooldowns: 2
};

const userCooldowns = new Map();

// ImgBB Links - Fast loading
const premiumImages = [
  "https://i.ibb.co/8gYwM6n/owner.jpg",
  "https://i.ibb.co/0jW1kzL/owner-card.png", 
  "https://i.ibb.co/7QyZyC7/premium-bot.jpg",
  "https://i.ibb.co/4T3yQh2/ai-robot.jpg"
];

async function sendOwnerCard(api, event, isCommand = false) {
  const now = Date.now();
  const userKey = event.senderID;
  
  if (userCooldowns.has(userKey) && (now - userCooldowns.get(userKey) < 10000)) {
    if (isCommand) {
      const remaining = Math.ceil((10000 - (now - userCooldowns.get(userKey))) / 1000);
      api.sendMessage(`⏳ Wait ${remaining}s`, event.threadID);
    }
    return;
  }

  userCooldowns.set(userKey, now);
  const cacheDir = path.join(__dirname, "cache");
  const imgPath = path.join(cacheDir, `owner_${Date.now()}.jpg`);

  try {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    // Direct image download without loading message
    const imgURL = premiumImages[Math.floor(Math.random() * premiumImages.length)];
    const response = await axios({
      method: 'GET',
      url: imgURL,
      responseType: 'arraybuffer',
      timeout: 5000
    });

    fs.writeFileSync(imgPath, Buffer.from(response.data));

    const premiumMessage = {
      body: `┏━━━━━━━━━━━━━━┓
   🤖 ULTRA OWNER CARD
┗━━━━━━━━━━━━━━┛

👑 Owner: ARYAN XD NITYA
🤖 Bot: ARYAN BOT ULTRA
⭐ Status: Permanent Active
💫 Level: Maximum Premium

📱 WhatsApp: Connected ✅
✈️ Telegram: t.me/Aryanchat4322
💻 GitHub: Aryan1435
🔧 Support: 24/7 Available

🎯 Aryan Me Premium Forever!`,
      attachment: fs.createReadStream(imgPath)
    };

    const messageInfo = await api.sendMessage(premiumMessage, event.threadID);

    // Fast reactions
    const reactions = ["🤖", "👑", "⭐", "💎"];
    for (let reaction of reactions) {
      await api.setMessageReaction(reaction, messageInfo.messageID, () => {}, true);
    }

    setTimeout(() => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, 8000);

  } catch (error) {
    // Fast fallback without image
    const fallbackMsg = `🤖 ARYAN BOT OWNER

👑 Owner: ARYAN XD NITYA
🤖 Bot: Aryan Bot Ultra  
⭐ Status: Permanent Active
📱 Telegram: t.me/Aryanchat4322
💻 GitHub: Aryan1435

🔧 24/7 Premium Support`;
    
    await api.sendMessage(fallbackMsg, event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function({ api, event }) {
  if (event.type !== "message" || event.senderID === api.getCurrentUserID()) return;

  const text = event.body?.toLowerCase() || "";
  const triggers = ["owner", "aryan", "vip", "premium"];
  
  if (triggers.some(word => text.includes(word))) {
    await sendOwnerCard(api, event, false);
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    return api.sendMessage(`🤖 OWNER HELP

!owner - Show owner card
Auto-trigger: owner, aryan, vip
Cooldown: 10s`, event.threadID);
  }
  
  await sendOwnerCard(api, event, true);
};
