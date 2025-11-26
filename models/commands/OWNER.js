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
  const text = event.body?.toLowerCase() || "";
  const triggerWords = ["owner", "prefix", "king", "viihan", "vip", "boss", "admin", "developer", "creator", "mirai"];
  
  if (triggerWords.some(word => text.includes(word))) {

    // Mirai Bot Compatible Images
    const premiumImages = [
      "https://i.imgur.com/5z5QmYy.jpeg",
      "https://i.imgur.com/8K3mQ2a.jpg", 
      "https://i.imgur.com/Lp7mR4z.png",
      "https://i.imgur.com/9M2k5Rb.jpg"
    ];
    
    let imgURL = premiumImages[Math.floor(Math.random() * premiumImages.length)];
    const imgPath = path.resolve(__dirname, "cache", "VIP_OWNER_CARD.jpg");
    
    try {
      // Create cache directory if not exists
      if (!fs.existsSync(path.dirname(imgPath))) {
        fs.mkdirSync(path.dirname(imgPath), { recursive: true });
      }

      const getImage = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(imgPath, Buffer.from(getImage));

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

      await api.sendMessage(premiumMessage, event.threadID, event.messageID);

      // Mirai compatible reactions
      const premiumReactions = ["🤖", "👑", "⭐", "💎"];
      for (let reaction of premiumReactions) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await api.setMessageReaction(reaction, event.messageID, () => {}, true);
      }

      // Auto cleanup cache
      setTimeout(() => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }, 10000);

    } catch (error) {
      console.error("Mirai Owner Card Error:", error);
      // Fallback text message
      api.sendMessage(`🤖 𝗠𝗜𝗥𝗔𝗜 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:\n\n👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: 𝗩𝗶𝗶𝗵𝗮𝗻 𝗥𝗗𝗫\n🤖 𝗕𝗼𝘁 𝗧𝘆𝗽𝗲: Mirai Bot\n⭐ 𝗦𝘁𝗮𝘁𝘂𝘀: Permanent Active\n📱 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: @ViihanRdx\n\n🔧 𝗠𝗶𝗿𝗮𝗶 𝗕𝗼𝘁 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗹𝗲`, event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "help") {
    return api.sendMessage(`🤖 𝗠𝗜𝗥𝗔𝗜 𝗢𝗪𝗡𝗘𝗥 𝗛𝗘𝗟𝗣:\n\n📌 Usage: owner, vip, king, boss, developer\n\n🔧 Bot Type: Mirai Bot\n🎯 Version: Premium 5.0\n\n✨ Just type "owner" to see premium card!`, event.threadID);
  }
  
  api.sendMessage(`🤖 𝗠𝗜𝗥𝗔𝗜 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗢𝗪𝗡𝗘𝗥\n\nType "owner" to see premium owner card!\n\n🔧 Mirai Bot Compatible\n🎯 Permanent Version 5.0`, event.threadID, event.messageID);
};
