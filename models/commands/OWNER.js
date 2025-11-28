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

// imgbb.com direct image links - 100% working
const imageUrls = [
  "https://i.ibb.co/2329JM2X/IMG-20251127-184500.png", // Main imgbb link
  ];

async function downloadImage(url, imgPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://imgbb.com/'
      }
    });
    
    if (response.status === 200) {
      fs.writeFileSync(imgPath, Buffer.from(response.data));
      return true;
    }
  } catch (error) {
    console.log(`Image download failed from: ${url}`);
    return false;
  }
}

async function sendRoyalCard(api, event, isCommand = false) {
  const user = event.senderID;
  const now = Date.now();

  // Cooldown check
  if (cooldown.has(user)) {
    const cooldownTime = cooldown.get(user);
    const remaining = 7000 - (now - cooldownTime);
    
    if (remaining > 0) {
      if (isCommand) {
        const waitSeconds = Math.ceil(remaining / 1000);
        api.sendMessage(`⏳ *Please wait:* ${waitSeconds} seconds`, event.threadID);
      }
      return;
    }
  }

  cooldown.set(user, now);

  // Create cache directory if not exists
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const imgPath = path.join(cacheDir, `royal_${Date.now()}.png`);

  try {
    let imageDownloaded = false;
    
    // Try all image URLs until one works
    for (const imageUrl of imageUrls) {
      console.log(`Trying to download from: ${imageUrl}`);
      imageDownloaded = await downloadImage(imageUrl, imgPath);
      if (imageDownloaded) {
        console.log(`Successfully downloaded from: ${imageUrl}`);
        break;
      }
    }

    if (!imageDownloaded) {
      throw new Error("All image URLs failed");
    }

    // Verify file exists and has content
    if (!fs.existsSync(imgPath) || fs.statSync(imgPath).size === 0) {
      throw new Error("Downloaded file is empty or missing");
    }

    const message = {
      body: `╔══✦•⚜•✦══╗
   👑 ARYAN OWNER CARD 👑
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
    console.log("Royal card sent successfully");

    // Add reactions
    const reactions = ["👑", "⚡", "💎", "🔥", "✨"];
    for (const reaction of reactions) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await api.setMessageReaction(reaction, sent.messageID, () => {}, true);
      } catch (reactionError) {
        console.log("Reaction failed:", reactionError);
      }
    }

    // Clean up file after 10 seconds
    setTimeout(() => {
      try {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
          console.log("Temporary file cleaned up");
        }
      } catch (cleanupError) {
        console.log("Cleanup error:", cleanupError);
      }
    }, 10000);

  } catch (error) {
    console.error("Royal card error:", error);
    
    let errorMessage = "❌ Royal Card Load Problem.\nTry again: !owner";
    
    // Specific error messages
    if (error.message.includes("All image URLs failed")) {
      errorMessage = "🌐 Network Issue: Couldn't load royal card image.\nPlease try again later.";
    } else if (error.message.includes("timeout")) {
      errorMessage = "⏰ Request timeout. Please try again: !owner";
    }
    
    api.sendMessage(errorMessage, event.threadID);
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (!event.body) return;
    
    const text = event.body.toLowerCase();
    const triggerWords = ["owner", "Malik", "boss", "vip", "king", "premium", "royal", "card"];
    
    if (triggerWords.some(word => text.includes(word))) {
      await sendRoyalCard(api, event, false);
    }
  } catch (error) {
    console.error("Event handler error:", error);
  }
};

module.exports.run = async ({ api, event }) => {
  await sendRoyalCard(api, event, true);
};

// Handle process exit to clean up
process.on('exit', () => {
  console.log('Cleaning up owner module...');
});

module.exports.onLoad = () => {
  console.log('Royal Owner Card Module Loaded Successfully!');
};
