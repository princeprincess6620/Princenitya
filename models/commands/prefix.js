const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot information with owner's Facebook profile",
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
    // 1️⃣ First send the bot info text
    const messageText = `
━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}

👤 Total Users: ${global.data.allUserID.length}
💬 Total Threads: ${global.data.allThreadID.length}

👑 Bot Owner: ${ownerName}

🌐 Profile: ${fbLink}
💬 Message: ${inboxLink}

━━━━━━━━━━━━━━━━━━
🔄 Fetching owner's profile...
━━━━━━━━━━━━━━━━━━
`;

    await api.sendMessage(messageText, event.threadID);

    // 2️⃣ Try to get Facebook profile photo using web scraping
    try {
      const profilePicUrl = `https://graph.facebook.com/${OWNER_UID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      // Download profile picture
      const cachePath = path.join(__dirname, `owner_profile_${OWNER_UID}.jpg`);
      
      const response = await axios({
        method: 'GET',
        url: profilePicUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on('finish', async () => {
        // Send profile photo with caption
        const attachment = fs.createReadStream(cachePath);
        
        const profileMessage = `
━━━━━━━━━━━━━━━━━━
👑 𝐎𝐖𝐍𝐄𝐑'𝐒 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 👑
━━━━━━━━━━━━━━━━━━

📛 Name: ${ownerName}
🆔 Facebook ID: ${OWNER_UID}
🔗 Profile URL: ${fbLink}
💌 Message: ${inboxLink}

📞 Contact shared below 👇
━━━━━━━━━━━━━━━━━━
`;

        api.sendMessage({
          body: profileMessage,
          attachment: attachment
        }, event.threadID, async (err, info) => {
          // Delete cached image after sending
          try { fs.unlinkSync(cachePath); } catch(e) {}
          
          if (!err) {
            // 3️⃣ Send contact card after photo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            api.shareContact(
              `📞 Contact Owner: ${ownerName}`,
              OWNER_UID,
              event.threadID,
              async (err, contactInfo) => {
                if (!err && contactInfo) {
                  // Auto unsend contact after 10 seconds
                  setTimeout(() => {
                    try {
                      api.unsendMessage(contactInfo.messageID);
                    } catch(e) {}
                  }, 10000);
                }
              }
            );
          }
        });
      });

      writer.on('error', async (err) => {
        console.log("Profile pic download error:", err);
        // Fallback without profile picture
        await sendFallbackProfile();
      });

    } catch (profileError) {
      console.log("Profile fetch error:", profileError);
      await sendFallbackProfile();
    }

  } catch (error) {
    console.error("Error in prefix command:", error);
    api.sendMessage("❌ Error fetching information. Please try again later.", event.threadID);
  }

  // Fallback function if profile pic fails
  async function sendFallbackProfile() {
    const fallbackMessage = `
━━━━━━━━━━━━━━━━━━
👑 𝐎𝐖𝐍𝐄𝐑'𝐒 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 👑
━━━━━━━━━━━━━━━━━━

📛 Name: ${ownerName}
🆔 Facebook ID: ${OWNER_UID}
🔗 Profile URL: ${fbLink}
💌 Message: ${inboxLink}

📸 Note: Profile picture unavailable
📞 Contact shared below 👇
━━━━━━━━━━━━━━━━━━
`;

    api.sendMessage(fallbackMessage, event.threadID, async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      api.shareContact(
        `📞 Contact Owner: ${ownerName}`,
        OWNER_UID,
        event.threadID,
        async (err, contactInfo) => {
          if (!err && contactInfo) {
            setTimeout(() => {
              try {
                api.unsendMessage(contactInfo.messageID);
              } catch(e) {}
            }, 10000);
          }
        }
      );
    });
  }
};
