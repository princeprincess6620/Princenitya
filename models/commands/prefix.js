const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot information with owner's Facebook profile and contact",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {
  const prefix = global.config.PREFIX;
  
  // Bot owner information
  const OWNER_UID = "61580003810694";
  const ownerName = "ARYAN";
  const fbLink = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const inboxLink = `https://m.me/${OWNER_UID}`;

  try {
    // Send initial processing message
    const processingMsg = await api.sendMessage("🔄 Fetching bot information and owner profile...", event.threadID);

    try {
      // Get user's name
      const userName = await Users.getNameUser(event.senderID);
      
      // Prepare bot info text
      const messageText = `
━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━

👋 Hello ${userName}!

🤖 Bot Name: ${global.config.BOTNAME || "ChatBot"}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands?.size || 0}

👤 Total Users: ${global.data?.allUserID?.length || 0}
💬 Total Threads: ${global.data?.allThreadID?.length || 0}

👑 Bot Owner: ${ownerName}

━━━━━━━━━━━━━━━━━━
📌 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄
━━━━━━━━━━━━━━━━━━
`;

      // Try to get Facebook profile photo
      const profilePicUrl = `https://graph.facebook.com/${OWNER_UID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      // Download profile picture
      const cachePath = path.join(__dirname, `owner_profile_${OWNER_UID}_${Date.now()}.jpg`);
      
      const response = await axios({
        method: 'GET',
        url: profilePicUrl,
        responseType: 'stream'
      });

      // Create write stream
      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      // Wait for download to complete
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Read the downloaded image
      const attachment = fs.createReadStream(cachePath);
      
      // Send bot info with profile photo
      await api.sendMessage({
        body: messageText,
        attachment: attachment
      }, event.threadID);

      // Delete cached image
      try { fs.unlinkSync(cachePath); } catch(e) {}

      // Send owner contact immediately after (in next message)
      const contactMessage = await api.sendMessage("📞 Sending owner contact information...", event.threadID);
      
      // Share contact card
      await api.shareContact(
        `👑 Owner: ${ownerName}\n📱 Profile: ${fbLink}\n💬 Message: ${inboxLink}`,
        OWNER_UID,
        event.threadID,
        async (err, contactInfo) => {
          // Delete processing messages
          try {
            api.unsendMessage(processingMsg.messageID);
            api.unsendMessage(contactMessage.messageID);
          } catch(e) {}
          
          if (!err && contactInfo) {
            // Auto unsend contact after 15 seconds
            setTimeout(() => {
              try {
                api.unsendMessage(contactInfo.messageID);
                api.sendMessage("✅ Owner contact shared successfully! (Contact card will auto-remove)", event.threadID);
              } catch(e) {}
            }, 15000);
          }
        }
      );

    } catch (profileError) {
      console.log("Profile fetch error:", profileError);
      
      // Fallback: Send bot info without profile picture
      const fallbackText = `
━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━

👋 Hello ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME || "ChatBot"}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands?.size || 0}

👤 Total Users: ${global.data?.allUserID?.length || 0}
💬 Total Threads: ${global.data?.allThreadID?.length || 0}

👑 Bot Owner: ${ownerName}
📱 Profile: ${fbLink}
💬 Message: ${inboxLink}

━━━━━━━━━━━━━━━━━━
📞 Sending owner contact...
━━━━━━━━━━━━━━━━━━
`;

      await api.sendMessage(fallbackText, event.threadID, async () => {
        // Share contact card
        await api.shareContact(
          `👑 Owner: ${ownerName}`,
          OWNER_UID,
          event.threadID,
          async (err, contactInfo) => {
            if (!err && contactInfo) {
              // Auto unsend contact after 15 seconds
              setTimeout(() => {
                try {
                  api.unsendMessage(contactInfo.messageID);
                } catch(e) {}
              }, 15000);
            }
          }
        );
      });
    }

  } catch (error) {
    console.error("Error in prefix command:", error);
    api.sendMessage("❌ Error fetching information. Please try again later.", event.threadID);
  }
};
