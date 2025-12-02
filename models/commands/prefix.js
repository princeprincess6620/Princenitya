const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Show bot and live account info",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

// Auto Trigger Words
const triggerWords = ["prefix", "Prefix", "PREFIX", "bot", "Bot", "info"];

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { body, threadID, senderID } = event;

  // Only trigger when body contains trigger text
  if (!body || !triggerWords.some(word => body.toLowerCase().includes(word.toLowerCase()))) return;

  const prefix = global.config.PREFIX;

  // OWNER DETAILS
  const ownerName = "ARIF BABU";
  const ownerID = "61572909482910"; // Apna UID yahan daalein
  
  // LIVE ACCOUNT DETAILS (Apne live account ki details daalein)
  const liveAccountName = "ARIF BABU LIVE"; // Apne live account ka naam
  const liveAccountID = "61572909482910"; // Live account ka UID (same ho sakta hai agar ek hi account hai)
  const liveAccountLink = "https://www.facebook.com/your_live_account_username";
  
  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  
  // Live account ka profile picture
  const liveAvatarURL = `https://graph.facebook.com/${liveAccountID}/picture?width=720&height=720`;
  
  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const inboxLink = `https://m.me/${ownerID}`;
  
  // Live streaming link (agar aap regularly live karte hain)
  const liveStreamLink = "https://www.facebook.com/your_page/live";
  
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const message = `
👋 Hi ${await Users.getNameUser(senderID)}!

🤖 Bot Information:
╭───────────────
│ 🤖 Bot Name: ${global.config.BOTNAME}
│ 🆔 Bot ID: ${api.getCurrentUserID()}
│ 🔧 Prefix: ${prefix}
│ 📚 Commands: ${global.client.commands.size}
│ 👤 Total Users: ${totalUsers}
│ 💬 Total Threads: ${totalThreads}
╰───────────────

👑 Owner Information:
╭───────────────
│ 👤 Name: ${ownerName}
│ 🌐 Profile: ${fbLink}
│ 💬 Message: ${inboxLink}
╰───────────────

📺 Live Account:
╭───────────────
│ 📢 Live Account: ${liveAccountName}
│ 🔗 Profile Link: ${liveAccountLink}
│ 🎥 Live Stream: ${liveStreamLink}
│ ⚡ Status: Currently Online
╰───────────────

📞 Contact for Live Shows/Support:
• Messenger: ${inboxLink}
• Live Account: ${liveAccountLink}

━━━━━━━━━━━━━━━━━━
Note: Bot owner ke live shows follow karne ke liye upar diye link par click karein!
`;

  try {
    const imgPath = path.join(__dirname, "/owner.jpg");
    const liveImgPath = path.join(__dirname, "/live_account.jpg");
    
    // Download owner profile picture
    const imgData = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgData.data));
    
    // Download live account profile picture
    const liveImgData = await axios.get(liveAvatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(liveImgPath, Buffer.from(liveImgData.data));

    api.sendMessage({
      body: message,
      attachment: [
        fs.createReadStream(imgPath),
        fs.createReadStream(liveImgPath)
      ]
    }, threadID, () => {
      // Clean up files
      fs.unlinkSync(imgPath);
      fs.unlinkSync(liveImgPath);
    });

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error loading profile images.", threadID);
  }
};

module.exports.run = () => {}; // run empty because it's auto-triggered
