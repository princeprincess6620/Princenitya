const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "10.0.0", 
  hasPermssion: 0,
  credits: "ARUN + MEGA ULTRA PREMIUM",
  description: "SUPER ULTRA MEGA OP OWNER CARD - GOD LEVEL",
  commandCategory: "system",
  usages: "owner",
  cooldowns: 2
};

// GOD LEVEL SYSTEMS
const userCooldowns = new Map();
const chatCooldowns = new Map();
const userStats = new Map();

// MEGA PREMIUM IMGUR IMAGES
const godLevelImages = [
  "https://i.imgur.com/5z5QmYy.jpeg", // God Bot
  "https://i.imgur.com/8K3mQ2a.jpg",   // Supreme Card
  "https://i.imgur.com/Lp7mR4z.png",   // Mega VIP
  "https://i.imgur.com/9M2k5Rb.jpg",   // Aryan God
  "https://i.imgur.com/Dor2K26.jpeg",  // Ultra Premium
  "https://i.imgur.com/XyZ123A.jpg",   // Next Level
  "https://i.imgur.com/AbC456B.png",   // OP Design
  "https://i.imgur.com/DeF789C.jpg",   // Ultimate VIP
  "https://i.imgur.com/GhI012D.png",   // Mega System
  "https://i.imgur.com/JkL345E.jpg",   // God Mode
  "https://i.imgur.com/MnO678F.png",   // Supreme Level
  "https://i.imgur.com/PqR901G.jpg"    // Final Form
];

// 3D ANIMATION FRAMES
const matrixFrames = [
  "▰▱▱▱▱▱▱▱▱ 10%",
  "▰▰▱▱▱▱▱▱▱ 20%", 
  "▰▰▰▱▱▱▱▱▱ 30%",
  "▰▰▰▰▱▱▱▱▱ 40%",
  "▰▰▰▰▰▱▱▱▱ 50%",
  "▰▰▰▰▰▰▱▱▱ 60%",
  "▰▰▰▰▰▰▰▱▱ 70%",
  "▰▰▰▰▰▰▰▰▱ 80%",
  "▰▰▰▰▰▰▰▰▰ 90%",
  "▰▰▰▰▰▰▰▰▰ 100%"
];

// GOD LEVEL REACTIONS
const godReactions = ["👑", "💎", "⚡", "🚀", "🔥", "🌟", "💫", "🎯", "🔮", "🛡️", "🎮", "🏆"];

async function sendGodLevelCard(api, event, isCommand = false) {
  const now = Date.now();
  const userKey = event.senderID;
  const chatKey = event.threadID;

  // GOD LEVEL COOLDOWN SYSTEM
  if (userCooldowns.has(userKey) && (now - userCooldowns.get(userKey) < 10000)) {
    if (isCommand) {
      const remaining = Math.ceil((10000 - (now - userCooldowns.get(userKey))) / 1000);
      const cooldownMsg = await api.sendMessage(
        `⏳ *GOD MODE COOLDOWN*\n\n🚫 Please wait ${remaining}s\n💫 System regenerating power...`,
        event.threadID
      );
      setTimeout(() => api.unsendMessage(cooldownMsg.messageID), 3000);
    }
    return;
  }

  userCooldowns.set(userKey, now);
  chatCooldowns.set(chatKey, now);

  // UPDATE USER STATS
  const userStat = userStats.get(userKey) || { count: 0, firstUse: now };
  userStat.count++;
  userStats.set(userKey, userStat);

  const cacheDir = path.join(__dirname, "cache");
  const imgPath = path.join(cacheDir, `GOD_LEVEL_${Date.now()}.jpg`);

  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // MEGA LOADING SEQUENCE
    let loadingMsg;
    if (isCommand) {
      loadingMsg = await api.sendMessage(
        `🎮 *INITIALIZING GOD LEVEL SYSTEM...*\n${matrixFrames[0]}`,
        event.threadID
      );

      // 3D LOADING ANIMATION
      for (let i = 1; i < matrixFrames.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        try {
          await api.editMessage(
            `🎮 *INITIALIZING GOD LEVEL SYSTEM...*\n${matrixFrames[i]}`,
            loadingMsg.messageID
          );
        } catch (e) {}
      }
    }

    console.log("🌌 ACTIVATING GOD LEVEL...");

    // MULTI-IMAGE DOWNLOAD SYSTEM
    let imageBuffer;
    for (const imgURL of godLevelImages) {
      try {
        console.log(`📸 Attempting: ${imgURL}`);
        const response = await axios({
          method: 'GET',
          url: imgURL,
          responseType: 'arraybuffer',
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/*',
            'Referer': 'https://imgur.com'
          }
        });

        if (response.status === 200 && response.data.length > 5000) {
          imageBuffer = response.data;
          console.log("✅ GOD IMAGE ACQUIRED");
          break;
        }
      } catch (e) {
        console.log(`❌ Failed: ${imgURL}`);
      }
    }

    if (!imageBuffer) {
      throw new Error("ALL IMAGE SOURCES FAILED");
    }

    fs.writeFileSync(imgPath, Buffer.from(imageBuffer));

    // CALCULATE USER RANK
    const userRank = userStat.count >= 10 ? "👑 GOD EMPEROR" :
                    userStat.count >= 5 ? "💎 SUPREME VIP" :
                    userStat.count >= 3 ? "⚡ ULTRA MEMBER" : "🌟 PREMIUM USER";

    // SUPER ULTRA MEGA MESSAGE DESIGN
    const godMessage = {
      body: `╔══════════════════════════════════╗
            🌌 *SUPREME GOD LEVEL CARD* 🌌
╚══════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
          🦸 *ARYAN XD NITYA* 🦸
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔─────────────────────────────────╗
         🤖 *SYSTEM OVERVIEW* 🤖
╚─────────────────────────────────╝

✦ *AI Core:* 🧠 QUANTUM NEURAL NETWORK
✦ *Status:* 🟢 COSMIC LEVEL ACTIVE
✦ *Version:* 🚀 10.0 GOD EDITION
✦ *Power:* 💪 INFINITE SUPREME
✦ *Rank:* ${userRank}

╔─────────────────────────────────╗
         🌐 *COSMIC NETWORK* 🌐
╚─────────────────────────────────╝

📡 *Quantum Link:* https://t.me/Aryanchat4322
💾 *Data Core:* https://github.com/Aryan1435
🛰️ *Satellite:* 24/7 ORBITAL SUPPORT
🔭 *Observatory:* REAL-TIME MONITORING

╔─────────────────────────────────╗
         ⚡ *POWER METRICS* ⚡
╚─────────────────────────────────╗

▰▰▰▰▰▰▰▰▰▰ AI Intelligence [100%]
▰▰▰▰▰▰▰▰▰▰ System Performance [100%]
▰▰▰▰▰▰▰▰▰▰ Security Shield [100%]
▰▰▰▰▰▰▰▰▰▰ Cosmic Speed [100%]
▰▰▰▰▰▰▰▰▰▰ Unlimited Power [100%]

╔─────────────────────────────────╗
         🎯 *DIVINE FEATURES* 🎯
╚─────────────────────────────────╝

• 🌟 QUANTUM AI PROCESSING
• ⚡ LIGHTNING FAST RESPONSE
• 🔒 IMPENETRABLE SECURITY
• 🎨 HOLOGRAPHIC INTERFACE
• 🚀 HYPERSPEED PERFORMANCE
• 💫 MULTI-DIMENSIONAL ACCESS
• 🛡️ COSMIC PROTECTION SHIELD
• 🌌 UNIVERSE LEVEL COMMANDS

╔─────────────────────────────────╗
         🏆 *DIVINE ACHIEVEMENTS* 🏆
╚─────────────────────────────────╝

🎖️  Supreme God Mode Activated
🎖️  Quantum Network Established  
🎖️  Cosmic Access Granted
🎖️  Infinite Power Achieved
🎖️  Universal Recognition

╔─────────────────────────────────╗
         📊 *USER STATISTICS* 📊
╚─────────────────────────────────╝

👤 User ID: ${userKey}
📈 Usage Count: ${userStat.count}
🎮 Rank: ${userRank}
⏰ First Access: ${new Date(userStat.firstUse).toLocaleTimeString()}

🔮 *Cosmic Mantra:* "ARYAN ME SUPREME GOD MODE!"

💫 *System Ready:* 🟢 FULLY OPERATIONAL
🎊 *Welcome Level:* 🌟 SUPREME ACCESS

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
     🚀 *WELCOME TO GOD LEVEL* 🚀
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
      attachment: fs.createReadStream(imgPath),
      mentions: [{
        tag: "@Aryan XD Nitya",
        id: event.senderID
      }]
    };

    // CLEANUP LOADING
    if (loadingMsg) {
      await api.unsendMessage(loadingMsg.messageID);
    }

    // SEND GOD MESSAGE
    const messageInfo = await api.sendMessage(godMessage, event.threadID);
    console.log("✅ GOD LEVEL ACTIVATED");

    // QUANTUM REACTION SYSTEM
    let reactionIndex = 0;
    const quantumReaction = async () => {
      if (reactionIndex < godReactions.length) {
        try {
          await api.setMessageReaction(godReactions[reactionIndex], messageInfo.messageID, () => {}, true);
          reactionIndex++;
          setTimeout(quantumReaction, 400);
        } catch (e) {}
      }
    };
    quantumReaction();

    // AUTO ENHANCEMENTS
    setTimeout(async () => {
      try {
        await api.sendMessage({
          body: `🌟 *SYSTEM ENHANCEMENT ACTIVATED*\n\n💫 User ${userKey} upgraded to ${userRank}\n🎯 Performance optimized to maximum\n🚀 Ready for next cosmic command!`,
          mentions: [{
            tag: `@User${userKey}`,
            id: event.senderID
          }]
        }, event.threadID);
      } catch (e) {}
    }, 3000);

    // QUANTUM CLEANUP
    setTimeout(() => {
      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
          console.log("🧹 Quantum Cache Purged");
        } catch (e) {}
      }
    }, 15000);

    // AUTO GOD MESSAGE ROTATION
    setTimeout(async () => {
      try {
        const rotationMessages = [
          "⚡ *God Mode Still Active* - System at 100% power!",
          "🌟 *Cosmic Connection Stable* - All systems optimal!",
          "🚀 *Quantum Network Secure* - Ready for commands!",
          "💎 *Supreme Performance* - Running flawlessly!"
        ];
        const randomMsg = rotationMessages[Math.floor(Math.random() * rotationMessages.length)];
        await api.sendMessage(randomMsg, event.threadID);
      } catch (e) {}
    }, 45000);

  } catch (error) {
    console.error("❌ COSMIC SYSTEM FAILURE:", error);
    
    // ULTIMATE FALLBACK SYSTEM
    const cosmicFallbacks = [
      `🌌 *QUANTUM SYSTEM OVERRIDE*\n\n👑 DIVINE OWNER: ARYAN XD NITYA\n🤖 SYSTEM: GOD LEVEL AI\n💫 STATUS: COSMIC ACTIVE\n🚀 VERSION: 10.0 SUPREME\n\n📡 Quantum Link Active\n💾 Data Stream Secure\n\n🔮 *ARYAN ME GOD MODE!*`,

      `⚡ *COSMIC NETWORK ACTIVE*\n\n🦸 USER: ${userKey}\n🎯 RANK: ${userStats.get(userKey)?.count ? "EXPERIENCED" : "NEW"}\n💎 LEVEL: SUPREME\n🌟 POWER: INFINITE\n\n🌐 Contact: @Aryanchat4322\n🔗 GitHub: Aryan1435\n\n🚀 *Quantum Connection Established*`,

      `🎮 *GOD LEVEL INTERFACE*\n\n🤖 AI CORE: ARYAN QUANTUM\n👑 OWNER: SUPREME COMMANDER\n⚡ PERFORMANCE: MAXIMUM\n💫 ACCESS: COSMIC LEVEL\n\n📱 Direct Link Available\n💻 Source Code Secure\n\n🔮 *System Override: Successful*`
    ];

    const selectedFallback = cosmicFallbacks[Math.floor(Math.random() * cosmicFallbacks.length)];
    
    if (loadingMsg) {
      await api.unsendMessage(loadingMsg.messageID);
    }
    
    await api.sendMessage(selectedFallback, event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function({ api, event }) {
  if (event.type !== "message" || event.senderID === api.getCurrentUserID()) return;

  const text = event.body?.toLowerCase() || "";
  const godTriggers = [
    "owner", "aryan", "god", "supreme", "ultra", "mega", "quantum", "cosmic",
    "vip", "premium", "king", "boss", "admin", "developer", "creator",
    "mirai", "bot owner", "xd", "nitya", "aryanxd", "aryan bot",
    "ultra premium", "god mode", "supreme level", "quantum ai"
  ];

  const shouldTrigger = godTriggers.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
  });

  if (shouldTrigger) {
    console.log(`🌌 GOD TRIGGER: "${event.body}"`);
    // ENHANCED TRIGGER LOGIC
    const triggerChance = Math.random();
    if (triggerChance < 0.8) { // 80% chance
      setTimeout(async () => {
        await sendGodLevelCard(api, event, false);
      }, 1000);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    const helpDesign = {
      body: `🌌 *SUPREME GOD LEVEL HELP* 🌌

╔═══════════════════════════╗
         🎮 *COMMANDS* 🎮
╚═══════════════════════════╝

!owner       - 🚀 ACTIVATE GOD LEVEL
!owner help  - 📚 SHOW THIS MESSAGE  
!owner stats - 📊 VIEW YOUR STATS
!owner info  - ℹ️  SYSTEM INFORMATION

╔═══════════════════════════╗
         ⚡ *FEATURES* ⚡
╚═══════════════════════════╝

• 🌟 GOD LEVEL INTERFACE
• 🚀 QUANTUM ANIMATIONS
• 💎 SUPREME REACTIONS
• 📊 USER STATISTICS
• 🎯 SMART TRIGGERS
• 🔮 COSMIC FALLBACKS

╔═══════════════════════════╗
         🔧 *SYSTEM* 🔧
╚═══════════════════════════╝

Version: 10.0 GOD EDITION
Cooldown: 10 Seconds  
Level: SUPREME ACCESS
Status: COSMIC ACTIVE

💫 *Type "owner" to experience divinity!*`
    };
    return api.sendMessage(helpDesign, event.threadID);
  }

  if (args[0] === "stats") {
    const userStat = userStats.get(event.senderID) || { count: 0, firstUse: Date.now() };
    return api.sendMessage({
      body: `📊 *YOUR GOD LEVEL STATS*\n\n👤 User: ${event.senderID}\n🎯 Usage Count: ${userStat.count}\n💫 Rank: ${userStat.count >= 10 ? "GOD EMPEROR" : userStat.count >= 5 ? "SUPREME VIP" : "MEMBER"}\n⏰ First Use: ${new Date(userStat.firstUse).toLocaleString()}\n\n🚀 Keep using to level up!`
    }, event.threadID);
  }

  if (args[0] === "info") {
    return api.sendMessage({
      body: `🤖 *ARYAN GOD LEVEL SYSTEM*\n\n🚀 Version: 10.0 SUPREME\n💎 Level: God Mode Activated\n👑 Owner: Aryan XD Nitya\n⚡ Performance: Quantum Speed\n🌌 Status: Cosmic Active\n\n🔮 *Divine Power Flowing...*`
    }, event.threadID);
  }

  console.log(`🎮 GOD COMMAND ACTIVATED BY: ${event.senderID}`);
  await sendGodLevelCard(api, event, true);
};

// QUANTUM CLEANUP ON EXIT
process.on('exit', () => {
  const cacheDir = path.join(__dirname, "cache");
  if (fs.existsSync(cacheDir)) {
    fs.readdirSync(cacheDir).forEach(file => {
      if (file.startsWith('GOD_LEVEL_')) {
        try {
          fs.unlinkSync(path.join(cacheDir, file));
        } catch (e) {}
      }
    });
  }
});
