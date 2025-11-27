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
  cooldowns: 1
};

module.exports.handleEvent = async function({ api, event }) {
  // Check if message is from a user and not the bot itself
  if (event.type !== "message" || event.senderID === api.getCurrentUserID()) {
    return;
  }
  
  const text = event.body?.toLowerCase() || "";
  const triggerWords = ["owner", "prefix", "king", "vip", "boss", "admin", "developer", "creator", "mirai", "aryan"];
  
  if (triggerWords.some(word => text.includes(word))) {
    // Add delay to prevent spam
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Premium Images
    const premiumImages = [
      "https://i.imgur.com/5z5QmYy.jpeg",
      "https://i.imgur.com/8K3mQ2a.jpg", 
      "https://i.imgur.com/Lp7mR4z.png",
      "https://i.imgur.com/9M2k5Rb.jpg"
    ];
    
    let imgURL = premiumImages[Math.floor(Math.random() * premiumImages.length)];
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, `VIP_OWNER_CARD_${Date.now()}.jpg`);
    
    try {
      // Create cache directory if not exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download image with timeout
      const response = await axios({
        method: 'GET',
        url: imgURL,
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      fs.writeFileSync(imgPath, Buffer.from(response.data));

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
      await api.sendMessage(premiumMessage, event.threadID, (err, info) => {
        if (!err) {
          // Add reactions to the sent message
          const premiumReactions = ["🤖", "👑", "⭐", "💎"];
          let reactionIndex = 0;
          
          const addReaction = () => {
            if (reactionIndex < premiumReactions.length) {
              api.setMessageReaction(premiumReactions[reactionIndex], info.messageID, () => {}, true);
              reactionIndex++;
              setTimeout(addReaction, 500);
            }
          };
          addReaction();
        }
        
        // Clean up image file after sending
        setTimeout(() => {
          if (fs.existsSync(imgPath)) {
            try {
              fs.unlinkSync(imgPath);
            } catch (e) {
              console.log("Cleanup error:", e);
            }
          }
        }, 5000);
      });

    } catch (error) {
      console.error("Mirai Owner Card Error:", error);
      // Fallback text message without image
      const fallbackMessage = `🤖 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:\n\n👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: 𝗔𝗥𝗬𝗔𝗡 𝗫𝗗 𝗡𝗜𝗧𝗬𝗔\n🤖 𝗕𝗼𝘁 𝗧𝘆𝗽𝗲: Aryan Bot\n⭐ 𝗦𝘁𝗮𝘁𝘂𝘀: Permanent Active\n📱 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: https://t.me/Aryanchat4322\n💻 𝗚𝗶𝘁𝗛𝘂𝗯: https://github.com/Aryan1435\n\n🔧 𝗔𝗿𝘆𝗮𝗻 𝗕𝗼𝘁 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗹𝗲`;
      api.sendMessage(fallbackMessage, event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    return api.sendMessage(`🤖 𝗔𝗥𝗬𝗔𝗡 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗛𝗘𝗟𝗣:\n\n📌 Usage: owner, vip, king, boss, developer, aryan\n\n🔧 Bot Type: Aryan Bot\n🎯 Version: Premium 5.0\n\n✨ Just type "owner" to see premium card!`, event.threadID);
  }
  
  // Trigger the handleEvent function manually when command is used
  this.handleEvent({ api, event });
};
