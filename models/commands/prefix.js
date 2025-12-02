const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "2.1.0",
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
    // Send initial processing message
    const processingMsg = await api.sendMessage("🔄 Fetching bot information and owner profile...", event.threadID);

    try {
      // Get user's name
      const userName = await Users.getNameUser(event.senderID);
      
      // Download profile picture
      const profilePicUrl = `https://graph.facebook.com/${OWNER_UID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
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
      
      // Create interactive buttons for Facebook profile
      const messageBody = `
━━━━━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━━━━━

👋 Hello ${userName}!

🤖 Bot Name: ${global.config.BOTNAME || "ChatBot"}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands?.size || 0}

👤 Total Users: ${global.data?.allUserID?.length || 0}
💬 Total Threads: ${global.data?.allThreadID?.length || 0}

━━━━━━━━━━━━━━━━━━━━━━
👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 👑
━━━━━━━━━━━━━━━━━━━━━━

📛 Name: ${ownerName}
🆔 Facebook ID: ${OWNER_UID}

📌 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐖𝐍𝐄𝐑:

🔗 Profile Link: ${fbLink}
📩 Message Link: ${inboxLink}

📱 Quick Actions:
1. Click profile link to visit Facebook
2. Click message link to chat directly
3. Or manually search: "ARYAN" on Facebook

━━━━━━━━━━━━━━━━━━━━━━
💡 Tip: Copy the links above to contact owner
━━━━━━━━━━━━━━━━━━━━━━
`;

      // Send message with profile photo and buttons
      await api.sendMessage({
        body: messageBody,
        attachment: attachment,
        mentions: [{
          tag: `@${ownerName}`,
          id: OWNER_UID
        }]
      }, event.threadID, async (error, info) => {
        // Delete processing message
        try { api.unsendMessage(processingMsg.messageID); } catch(e) {}
        
        // Delete cached image
        try { fs.unlinkSync(cachePath); } catch(e) {}
        
        if (!error) {
          // Send additional interactive message with buttons
          const buttonMessage = {
            body: `📞 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 ${ownerName} DIRECTLY:\n\n👇 Tap buttons below to connect:`,
            mentions: [{
              tag: `@${ownerName}`,
              id: OWNER_UID
            }],
            // Create interactive buttons (if supported by your bot platform)
            // Note: Facebook Messenger may not support buttons in all cases
          };
          
          // Send contact info as separate message
          await api.sendMessage(buttonMessage, event.threadID);
          
          // Send clickable links
          await api.sendMessage({
            body: `🔗 𝐂𝐋𝐈𝐂𝐊𝐀𝐁𝐋𝐄 𝐋𝐈𝐍𝐊𝐒:\n\n🌐 View Profile: ${fbLink}\n💬 Send Message: ${inboxLink}\n\n📱 Simply click/tap on these links to open in browser/messenger`
          }, event.threadID);
        }
      });

    } catch (profileError) {
      console.log("Profile fetch error:", profileError);
      
      // Fallback: Send bot info without profile picture
      const fallbackText = `
━━━━━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━━━━━

👋 Hello ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME || "ChatBot"}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands?.size || 0}

👤 Total Users: ${global.data?.allUserID?.length || 0}
💬 Total Threads: ${global.data?.allThreadID?.length || 0}

━━━━━━━━━━━━━━━━━━━━━━
👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 👑
━━━━━━━━━━━━━━━━━━━━━━

📛 Name: ${ownerName}
🆔 Facebook ID: ${OWNER_UID}

📌 𝐃𝐈𝐑𝐄𝐂𝐓 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐋𝐈𝐍𝐊𝐒:

🔗 Profile: ${fbLink}
💬 Message: ${inboxLink}

━━━━━━━━━━━━━━━━━━━━━━
🚀 How to contact:
1. Copy the Facebook profile link
2. Paste in browser to visit profile
3. Or click message link to chat directly
━━━━━━━━━━━━━━━━━━━━━━
`;

      // Delete processing message
      try { api.unsendMessage(processingMsg.messageID); } catch(e) {}
      
      // Send fallback message
      await api.sendMessage(fallbackText, event.threadID);
      
      // Try alternative contact sharing method
      try {
        // Send as separate clickable message
        const contactMessage = `
📲 𝐂𝐋𝐈𝐂𝐊 𝐓𝐎 𝐂𝐎𝐍𝐍𝐄𝐂𝐓:

👉 Profile: ${fbLink}
👉 Message: ${inboxLink}

💡 These are clickable links. Tap/click to open!
`;
        
        await api.sendMessage(contactMessage, event.threadID);
      } catch (contactError) {
        console.log("Contact sharing error:", contactError);
      }
    }

  } catch (error) {
    console.error("Error in prefix command:", error);
    
    // Try to delete processing message if exists
    try { 
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID); 
      }
    } catch(e) {}
    
    // Send simple error message
    const errorMessage = `
🤖 Bot Information:

• Bot Name: ${global.config.BOTNAME || "ChatBot"}
• Prefix: ${prefix}
• Owner: ${ownerName}
• Owner Facebook: ${fbLink}
• Message Owner: ${inboxLink}

📞 Contact owner using the links above.
    `;
    
    api.sendMessage(errorMessage, event.threadID);
  }
};
