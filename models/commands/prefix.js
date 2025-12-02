const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Show bot owner info",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

// Auto Trigger Words - More words add kiye hain
const triggerWords = ["prefix", "Prefix", "PREFIX", "owner", "Owner", "OWNER", "admin", "Admin", "info", "Info"];

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { body, threadID, senderID } = event;

  // Check if message contains any trigger word
  if (!body || !triggerWords.some(word => body.toLowerCase().includes(word.toLowerCase()))) return;

  const prefix = global.config.PREFIX;

  // APNE FACEBOOK ACCOUNT KI DETAILS YAHAN DALEN
  const ownerName = "Tüst Me Bağlı, I Will İşde Bıçak Yolu Heti";
  const ownerID = "1000238906"; // Your Facebook UID from image
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  
  // Facebook links
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;
  
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const message = `
╔══════════════════╗
     🤖 BOT OWNER INFO
╚══════════════════╝

👤 OWNER NAME:
┏━━━━━━━━━━━━━━━━━━┓
${ownerName}
┗━━━━━━━━━━━━━━━━━━┛

📌 CONTACT LINKS:
╭─────────────────
├ 📱 Facebook Profile
├ ➤ ${fbLink}
├ 
├ 💬 Message on Messenger
├ ➤ ${inboxLink}
╰─────────────────

🤖 BOT INFORMATION:
╭─────────────────
├ 🔧 Prefix: ${prefix}
├ 📚 Commands: ${global.client.commands.size}
├ 👥 Users: ${totalUsers}
├ 💭 Threads: ${totalThreads}
╰─────────────────

✨ Quote: "J + F + > Facebook"
    
⚠️ Note: Agar koi problem hai to direct message karein!

━━━━━━━━━━━━━━━━━━
💡 Hint: ${prefix}help - All commands dekhein
`;

  try {
    // Profile picture download karein
    const imgPath = path.join(__dirname, "/cache/owner_profile.jpg");
    
    // Ensure cache directory exists
    if (!fs.existsSync(path.dirname(imgPath))) {
      fs.mkdirSync(path.dirname(imgPath), { recursive: true });
    }
    
    const response = await axios({
      method: 'GET',
      url: avatarURL,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    fs.writeFileSync(imgPath, Buffer.from(response.data));

    // Message send karein with profile picture
    api.sendMessage({
      body: message,
      attachment: fs.createReadStream(imgPath)
    }, threadID, (err) => {
      if (err) {
        console.error("Error sending message:", err);
        api.sendMessage(message, threadID); // Text only send karein agar image error de
      }
      // Clean up
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

  } catch (error) {
    console.error("Error:", error);
    
    // Agar profile picture nahi load ho paaye to text message bhejein
    const fallbackMessage = `
${ownerName}

📌 Profile: ${fbLink}
💬 Message: ${inboxLink}

Bot Prefix: ${prefix}
Total Users: ${totalUsers}

${error.message ? `Error: ${error.message}` : ''}
`;
    
    api.sendMessage(fallbackMessage, threadID);
  }
};

module.exports.run = async ({ api, event }) => {
  // Manual trigger ke liye bhi
  const prefix = global.config.PREFIX;
  const ownerName = "Tüst Me Bağlı, I Will İşde Bıçak Yolu Heti";
  const ownerID = "1000238906";
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;
  
  api.sendMessage(`
🤖 Bot Owner Information:

👤 ${ownerName}

🔗 Links:
• Profile: ${fbLink}
• Message: ${inboxLink}

Prefix: ${prefix}

Type "owner" or "prefix" anytime to see this info!
  `, event.threadID);
};
