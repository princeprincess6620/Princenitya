const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "7.0.0", 
  hasPermssion: 0,
  credits: "ARUN + VIP ULTRA PREMIUM",
  description: "ULTIMATE OP OWNER CARD - NEXT LEVEL",
  commandCategory: "system",
  usages: "owner",
  cooldowns: 3
};

// Advanced cooldown system
const userCooldowns = new Map();
const chatCooldowns = new Map();

// Ultra Premium Imgur Images
const premiumImages = [
  "https://i.imgur.com/5z5QmYy.jpeg", // Premium Bot
  "https://i.imgur.com/8K3mQ2a.jpg",   // Owner Card
  "https://i.imgur.com/Lp7mR4z.png",   // VIP Badge
  "https://i.imgur.com/9M2k5Rb.jpg",   // Aryan Special
  "https://i.imgur.com/Dor2K26.jpeg",  // Ultra Premium
  "https://i.imgur.com/XyZ123A.jpg",   // Next Level
  "https://i.imgur.com/AbC456B.png",   // OP Design
  "https://i.imgur.com/DeF789C.jpg"    // Ultimate VIP
];

// Animation frames for loading effect
const loadingFrames = ["🔄", "⚡", "🌟", "💫", "✨", "🎯", "🔥", "💎"];

async function sendOwnerCard(api, event, isCommand = false) {
  const now = Date.now();
  const userKey = event.senderID;
  const chatKey = event.threadID;
  
  // Advanced cooldown check
  if (userCooldowns.has(userKey) && (now - userCooldowns.get(userKey) < 15000)) {
    if (isCommand) {
      const remaining = Math.ceil((15000 - (now - userCooldowns.get(userKey))) / 1000);
      api.sendMessage(`⏳ *Cooldown Active* - Please wait ${remaining}s`, event.threadID, event.messageID);
    }
    return;
  }

  // Chat cooldown to prevent spam
  if (chatCooldowns.has(chatKey) && (now - chatCooldowns.get(chatKey) < 5000)) {
    return;
  }

  userCooldowns.set(userKey, now);
  chatCooldowns.set(chatKey, now);

  const cacheDir = path.join(__dirname, "cache");
  const imgPath = path.join(cacheDir, `ULTRA_OWNER_${Date.now()}.jpg`);
  
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Send loading message
    let loadingMsg;
    if (isCommand) {
      let loadingIndex = 0;
      loadingMsg = await api.sendMessage(`🎮 *Loading ULTRA PREMIUM Owner Card...* ${loadingFrames[loadingIndex]}`, event.threadID);
      
      // Animate loading
      const loadingInterval = setInterval(async () => {
        loadingIndex = (loadingIndex + 1) % loadingFrames.length;
        try {
          await api.editMessage(`${loadingFrames[loadingIndex]} *Initializing VIP System...* ${loadingFrames[loadingIndex]}`, loadingMsg.messageID);
        } catch (e) {}
      }, 500);
      
      // Stop animation after 3 seconds
      setTimeout(() => clearInterval(loadingInterval), 3000);
    }

    console.log("🚀 Starting ULTRA PREMIUM Owner Card...");
    
    // Select random premium image
    const imgURL = premiumImages[Math.floor(Math.random() * premiumImages.length)];
    console.log(`📸 Selected Image: ${imgURL}`);

    // Download image with enhanced error handling
    const response = await axios({
      method: 'GET',
      url: imgURL,
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
        'Referer': 'https://imgur.com'
      }
    });

    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    
    fs.writeFileSync(imgPath, Buffer.from(response.data));
    console.log("✅ Premium Image Downloaded");

    // Ultra Premium Message Design
    const ultraMessage = {
      body: `┏━━━━━━━━━━━━━━━━━━━┓
         🚀 *ULTRA PREMIUM OWNER CARD* 🚀
┗━━━━━━━━━━━━━━━━━━━┛

╔═══════════════════════════╗
         👑 *ARYAN XD NITYA* 👑
╚═══════════════════════════╝

✦ *Bot System:* 🤖 ARYAN BOT ULTRA
✦ *Status:* 🟢 PERMANENT ACTIVE  
✦ *Level:* 💎 MAXIMUM PREMIUM
✦ *Version:* 🚀 7.0 ULTRA EDITION
✦ *Framework:* ⚡ ARYAN AI FRAMEWORK

┌─────────────────────────┐
    🌐 *CONTACT NETWORK* 🌐
└─────────────────────────┘

📱 *WhatsApp:* 🔗 DIRECT CONNECTED
✈️ *Telegram:* https://t.me/Aryanchat4322
💻 *GitHub:* https://github.com/Aryan1435
🎮 *Support:* 24/7 ULTRA PREMIUM

┌─────────────────────────┐
    ⚡ *SYSTEM STATUS* ⚡  
└─────────────────────────┘

✅ *Bot Engine:* ARYAN AI CORE v7.0
✅ *Security:* 🔒 ULTRA ENCRYPTED
✅ *Performance:* 🚀 OPTIMIZED MAX
✅ *Uptime:* ⏰ 100% PERMANENT
✅ *Features:* 🌟 UNLIMITED ACCESS

┌─────────────────────────┐
    💎 *PREMIUM FEATURES* 💎
└─────────────────────────┘

• 🎯 ARYAN BOT ULTRA COMPATIBLE
• ⚡ 24/7 PERMANENT OPERATION
• 🔥 EXCLUSIVE VIP COMMANDS  
• 🌟 ADVANCED AI FEATURES
• 💫 AUTO UPDATE SYSTEM
• 🛡️ PREMIUM SECURITY
• 🚀 HIGH SPEED PERFORMANCE
• 🎨 CUSTOM THEMES

┌─────────────────────────┐
    🎯 *ACHIEVEMENTS* 🎯
└─────────────────────────┘

🏆 *Ultra Premium Activated*
🏆 *VIP System Enabled* 
🏆 *Maximum Level Reached*
🏆 *Permanent Access Granted*

🔮 *Motto:* "ARYAN ME ULTRA PREMIUM FOREVER!" 

💫 *Power Level:* ██████████ 100%
🎊 *User Rank:* 👑 ULTRA VIP MEMBER

┏━━━━━━━━━━━━━━━━━━━┓
   🔥 *WELCOME TO ULTRA* 🔥
┗━━━━━━━━━━━━━━━━━━━┛`,
      attachment: fs.createReadStream(imgPath),
      mentions: [{
        tag: "@Aryan XD Nitya",
        id: event.senderID
      }]
    };

    // Delete loading message if exists
    if (loadingMsg) {
      await api.unsendMessage(loadingMsg.messageID);
    }

    // Send main message
    const messageInfo = await api.sendMessage(ultraMessage, event.threadID);
    console.log("✅ ULTRA Message Sent");

    // Advanced Reaction System
    const ultraReactions = ["🚀", "👑", "💎", "⚡", "🌟", "🔥", "🎯", "💫"];
    let reactionIndex = 0;
    
    const addUltraReaction = async () => {
      if (reactionIndex < ultraReactions.length) {
        try {
          await api.setMessageReaction(ultraReactions[reactionIndex], messageInfo.messageID, () => {}, true);
          reactionIndex++;
          setTimeout(addUltraReaction, 600);
        } catch (e) {}
      }
    };
    addUltraReaction();

    // Auto-cleanup with enhanced system
    setTimeout(() => {
      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
          console.log("🧹 Ultra Cache Cleaned");
        } catch (e) {}
      }
    }, 10000);

    // Auto unsend after 2 minutes (optional)
    setTimeout(async () => {
      try {
        await api.unsendMessage(messageInfo.messageID);
      } catch (e) {}
    }, 120000);

  } catch (error) {
    console.error("❌ ULTRA System Error:", error);
    
    // Ultra Fallback System
    const fallbackMessages = [
      `🚀 *ARYAN ULTRA PREMIUM*\n\n👑 Owner: ARYAN XD NITYA\n🤖 System: ARYAN BOT ULTRA\n⭐ Status: PERMANENT ACTIVE\n💎 Level: MAXIMUM PREMIUM\n\n📱 Telegram: @Aryanchat4322\n💻 GitHub: Aryan1435\n\n🔮 *ARYAN ME ULTRA!*`,

      `💎 *ULTRA VIP OWNER*\n\n👑 ARYAN XD NITYA\n⚡ BOT SYSTEM: ARYAN ULTRA\n🌟 VERSION: 7.0 PREMIUM\n🎯 STATUS: 24/7 ACTIVE\n\n🌐 Contact: @Aryanchat4322\n🔗 GitHub: Aryan1435\n\n🚀 *Maximum Power Activated*`,

      `🔥 *ARYAN PREMIUM NETWORK*\n\n🤖 ULTRA BOT SYSTEM\n👑 OWNER: ARYAN XD NITYA\n💎 LEVEL: MAXIMUM VIP\n⚡ PERFORMANCE: OPTIMIZED\n\n📱 Connect: @Aryanchat4322\n💻 Code: Aryan1435\n\n🎯 *Ultra Mode: Activated*`
    ];

    const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    
    if (loadingMsg) {
      await api.unsendMessage(loadingMsg.messageID);
    }
    
    await api.sendMessage(randomFallback, event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function({ api, event }) {
  if (event.type !== "message" || event.senderID === api.getCurrentUserID()) return;

  const text = event.body?.toLowerCase() || "";
  const ultraTriggers = [
    "owner", "aryan", "vip", "premium", "ultra", "king", "boss", 
    "admin", "developer", "creator", "mirai", "bot owner",
    "xd", "nitya", "aryanxd", "aryan bot", "ultra premium"
  ];

  const shouldTrigger = ultraTriggers.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
  });

  if (shouldTrigger) {
    console.log(`🔔 ULTRA Trigger: "${event.body}"`);
    // Random chance for auto-trigger (60%)
    if (Math.random() < 0.6) {
      await sendOwnerCard(api, event, false);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    const helpMsg = {
      body: `🚀 *ARYAN ULTRA PREMIUM HELP* 🚀

📌 *Command:* !owner
📌 *Auto-Trigger:* owner, aryan, vip, premium, ultra

🎯 *Features:*
• ULTRA PREMIUM Owner Card
• Multiple High-Quality Images  
• Advanced Reaction System
• Loading Animation
• Auto Cleanup
• Smart Cooldown

⚡ *System Info:*
• Version: 7.0 ULTRA EDITION
• Cooldown: 15 Seconds
• Level: MAXIMUM PREMIUM
• Status: PERMANENT ACTIVE

💎 *Just type "owner" to experience ULTRA!*`
    };
    return api.sendMessage(helpMsg, event.threadID);
  }

  if (args[0] === "info") {
    return api.sendMessage(`🤖 *ARYAN BOT ULTRA SYSTEM*\n\n🚀 Version: 7.0 ULTRA\n💎 Level: Maximum Premium\n👑 Owner: Aryan XD Nitya\n⚡ Status: Permanent Active\n\n🔮 *Ultra Power Activated*`, event.threadID);
  }

  console.log(`🎮 ULTRA Command Activated by: ${event.senderID}`);
  await sendOwnerCard(api, event, true);
};
