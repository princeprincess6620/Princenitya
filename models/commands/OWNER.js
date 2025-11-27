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

// ImgBB Links - India mein best work karte hain
const premiumImages = [
  "https://i.ibb.co/8gYwM6n/owner.jpg",      // Main owner image
  "https://i.ibb.co/0jW1kzL/owner-card.png", // Premium card
  "https://i.ibb.co/7QyZyC7/premium-bot.jpg", // Bot image
  "https://i.ibb.co/4T3yQh2/ai-robot.jpg"    // AI robot
];

async function sendOwnerCard(api, event, isCommand = false) {
  const now = Date.now();
  const userKey = event.senderID;
  
  // Cooldown check
  if (userCooldowns.has(userKey) && (now - userCooldowns.get(userKey) < 10000)) {
    if (isCommand) {
      const remaining = Math.ceil((10000 - (now - userCooldowns.get(userKey))) / 1000);
      api.sendMessage(`⏳ Please wait ${remaining}s`, event.threadID);
    }
    return;
  }

  userCooldowns.set(userKey, now);
  const cacheDir = path.join(__dirname, "cache");
  const imgPath = path.join(cacheDir, `owner_${Date.now()}.jpg`);

  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    let loadingMsg;
    if (isCommand) {
      loadingMsg = await api.sendMessage("🚀 Loading Premium Card...", event.threadID);
    }

    // Try each ImgBB link until one works
    let imageBuffer;
    for (const imgURL of premiumImages) {
      try {
        console.log(`📸 Trying: ${imgURL}`);
        const response = await axios({
          method: 'GET',
          url: imgURL,
          responseType: 'arraybuffer',
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.status === 200) {
          imageBuffer = response.data;
          console.log("✅ Image loaded successfully");
          break;
        }
      } catch (error) {
        console.log(`❌ Failed: ${imgURL}`);
        continue;
      }
    }

    if (!imageBuffer) {
      throw new Error("All image sources failed");
    }

    fs.writeFileSync(imgPath, Buffer.from(imageBuffer));

    const premiumMessage = {
      body: `┏━━━━━━━━━━━━━━┓
   🤖 ULTRA OWNER CARD
┗━━━━━━━━━━━━━━┛

👑 *Owner:* ARYAN XD NITYA
🤖 *Bot:* ARYAN BOT ULTRA
⭐ *Status:* Permanent Active
💫 *Level:* Maximum Premium

━━━━━━━━━━━━━━
🌐 CONTACTS
━━━━━━━━━━━━━━
📱 WhatsApp: Connected ✅
✈️ Telegram: t.me/Aryanchat4322
💻 GitHub: Aryan1435
🔧 Support: 24/7 Available

━━━━━━━━━━━━━━
⚡ FEATURES
━━━━━━━━━━━━━━
• Ultra Fast Performance
• Premium Commands
• 24/7 Active
• Auto Updates

🎯 *Aryan Me Premium Forever!*`,
      attachment: fs.createReadStream(imgPath)
    };

    if (loadingMsg) await api.unsendMessage(loadingMsg.messageID);
    
    const messageInfo = await api.sendMessage(premiumMessage, event.threadID);
    console.log("✅ Owner card sent successfully");

    // Add reactions
    const reactions = ["🤖", "👑", "⭐", "💎"];
    for (let i = 0; i < reactions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await api.setMessageReaction(reactions[i], messageInfo.messageID, () => {}, true);
    }

    // Cleanup
    setTimeout(() => {
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
        console.log("🧹 Cache cleaned");
      }
    }, 10000);

  } catch (error) {
    console.error("Error:", error);
    
    // Fallback without image
    const fallbackMsg = `🤖 ARYAN BOT OWNER

👑 Owner: ARYAN XD NITYA
🤖 Bot Type: Aryan Bot Ultra
⭐ Status: Permanent Active
📱 Telegram: t.me/Aryanchat4322
💻 GitHub: Aryan1435

🔧 24/7 Premium Support`;
    
    if (loadingMsg) await api.unsendMessage(loadingMsg.messageID);
    await api.sendMessage(fallbackMsg, event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function({ api, event }) {
  if (event.type !== "message" || event.senderID === api.getCurrentUserID()) return;

  const text = event.body?.toLowerCase() || "";
  const triggers = ["owner", "aryan", "vip", "premium", "boss", "admin"];
  
  if (triggers.some(word => text.includes(word))) {
    // 70% chance to trigger
    if (Math.random() < 0.7) {
      await sendOwnerCard(api, event, false);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    return api.sendMessage(`🤖 OWNER HELP MENU

!owner - Show premium owner card
!owner help - Show this help

🔄 Auto-trigger words:
owner, aryan, vip, premium, boss

⏰ Cooldown: 10 seconds
🎯 Version: 10.0 Ultra`, event.threadID);
  }
  
  await sendOwnerCard(api, event, true);
};
