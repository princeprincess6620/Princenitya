const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "5.0.0", 
  hasPermssion: 0,
  credits: "ARUN + VIP Premium Mirai Edition",
  description: "Ultimate Premium Owner Info Card - Mirai Bot",
  commandCategory: "system",
  usages: "owner",
  cooldowns: 5
};

// Cooldown tracking
const userCooldowns = new Map();

async function sendOwnerCard(api, event, isCommand = false) {
  const now = Date.now();
  const cooldownTime = 10 * 1000; // 10 seconds cooldown
  const userKey = event.senderID;
  
  // Check cooldown
  if (userCooldowns.has(userKey)) {
    const lastUsed = userCooldowns.get(userKey);
    if (now - lastUsed < cooldownTime) {
      if (isCommand) {
        const remaining = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
        api.sendMessage(`⏰ Please wait ${remaining} seconds before using this command again.`, event.threadID, event.messageID);
      }
      return;
    }
  }
  
  // Set cooldown
  userCooldowns.set(userKey, now);

  // Working Premium Images (tested URLs)
  const premiumImages = [
    "https://i.ibb.co/0Q8Kz1M/hero-img.png", // High quality bot image
    "https://i.ibb.co/4T3yQh2/ai-robot.jpg", // Robot image
    "https://i.ibb.co/7QyZyC7/premium-bot.jpg", // Premium bot
    "https://i.ibb.co/0jW1kzL/owner-card.png" // Owner card template
  ];
  
  let imgURL = premiumImages[Math.floor(Math.random() * premiumImages.length)];
  const cacheDir = path.join(__dirname, "cache");
  const imgPath = path.join(cacheDir, `owner_${event.senderID}_${Date.now()}.jpg`);
  
  try {
    // Create cache directory if not exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    console.log("📥 Downloading image from:", imgURL);
    
    // Download image with timeout and better error handling
    const response = await axios({
      method: 'GET',
      url: imgURL,
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    fs.writeFileSync(imgPath, Buffer.from(response.data));
    console.log("✅ Image downloaded successfully");

    const premiumMessage = {
      body: `╔═════⋆✦⋆══════╗
   🤖 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗖𝗔𝗥𝗗  🤖
╚══════⋆✦⋆══════╝

✨ *𝗔𝗥𝗬𝗔𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗩𝗘𝗥𝗦𝗜𝗢𝗡* ✨

👑 *Bot Owner:* 𝗔𝗥𝗬𝗔𝗡 𝗫𝗗 𝗡𝗜𝗧𝗬𝗔
🤖 *Bot Type:* Aryan Bot
⭐ *Status:* Permanent Active
💫 *Level:* Maximum Premium
🎯 *Specialty:* Aryan Bot Development

━━━━━━━━━━━━━━━
🌐 𝗔𝗥𝗬𝗔𝗡 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗦
━━━━━━━━━━━━━━━
📱 *WhatsApp:* ARYAN Connected ✅
✈️ *Telegram:* https://t.me/Aryanchat4322
💻 *GitHub:* https://github.com/Aryan1435
🔧 *Support:* 24/7 Available

━━━━━━━━━━━━━━━
🛡️ 𝗔𝗥𝗬𝗔𝗡 𝗦𝗧𝗔𝗧𝗨𝗦
━━━━━━━━━━━━━━━
✅ Bot System: Aryan Framework
🔒 Version: Premium 5.0
📅 Framework: Aryan Bot
⚡ Performance: Optimized

━━━━━━━━━━━━━━━
💎 𝗔𝗥𝗬𝗔𝗡 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦
━━━━━━━━━━━━━━━
• Aryan Bot Compatible
• 24/7 Permanent Operation  
• Premium Command Access
• Exclusive VIP Features
• Permanent Updates

🎯 *Motto:* "Aryan Me Premium Forever!"
━━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(imgPath)
    };

    // Send message
    const messageInfo = await api.sendMessage(premiumMessage, event.threadID);
    console.log("✅ Message sent successfully");

    // Add reactions
    try {
      const premiumReactions = ["🤖", "👑", "⭐", "💎"];
      for (let i = 0; i < premiumReactions.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        await api.setMessageReaction(premiumReactions[i], messageInfo.messageID, () => {}, true);
      }
    } catch (reactionError) {
      console.log("⚠️ Reactions failed, but message sent");
    }

    // Clean up image file after sending
    setTimeout(() => {
      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
          console.log("🧹 Cache cleaned");
        } catch (e) {
          console.log("Cleanup error:", e);
        }
      }
    }, 8000);

  } catch (error) {
    console.error("❌ Image download failed:", error.message);
    
    // Fallback text message without image
    const fallbackMessage = `🤖 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:

👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: 𝗔𝗥𝗬𝗔𝗡 𝗫𝗗 𝗡𝗜𝗧𝗬𝗔
🤖 𝗕𝗼𝘁 𝗧𝘆𝗽𝗲: Aryan Bot  
⭐ 𝗦𝘁𝗮𝘁𝘂𝘀: Permanent Active
💫 𝗟𝗲𝘃𝗲𝗹: Maximum Premium

━━━━━━━━━━━━━━━
🌐 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗦
━━━━━━━━━━━━━━━
📱 WhatsApp: ARYAN Connected ✅
✈️ Telegram: https://t.me/Aryanchat4322
💻 GitHub: https://github.com/Aryan1435
🔧 Support: 24/7 Available

🎯 "Aryan Me Premium Forever!"`;
    
    await api.sendMessage(fallbackMessage, event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function({ api, event }) {
  // Check if message is from a user and not the bot itself
  if (event.type !== "message" || event.senderID === api.getCurrentUserID()) {
    return;
  }
  
  const text = event.body?.toLowerCase() || "";
  const triggerWords = ["owner", "king", "vip", "boss", "admin", "developer", "creator", "mirai", "aryan", "premium"];
  
  // Check if message contains exactly trigger words (not just parts of other words)
  const shouldTrigger = triggerWords.some(word => {
    if (text === word) return true; // exact match
    if (text.includes(` ${word} `)) return true; // word with spaces around
    if (text.startsWith(`${word} `)) return true; // word at start
    if (text.endsWith(` ${word}`)) return true; // word at end
    return false;
  });
  
  if (shouldTrigger) {
    console.log(`🔔 Triggered by: "${event.body}"`);
    await sendOwnerCard(api, event, false);
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    return api.sendMessage(`🤖 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗛𝗘𝗟𝗣:

📌 Usage: !owner 
📌 Auto-trigger: owner, vip, king, boss, aryan

🔧 Bot Type: Aryan Bot
🎯 Version: Premium 5.0
⏰ Cooldown: 10 seconds

✨ Just type "owner" to see premium card!`, event.threadID);
  }
  
  console.log(`🔔 Command triggered: !owner`);
  await sendOwnerCard(api, event, true);
};
