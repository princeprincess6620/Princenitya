const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Bot information with owner contact",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {
  const prefix = global.config.PREFIX;

  // ✅ IMPROVED OWNER INFO
  const OWNER_UID = "61580003810694";
  const ownerName = "ARYAN";
  
  // ✅ MULTIPLE CONTACT OPTIONS
  const contactOptions = `
📞 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐏𝐓𝐈𝐎𝐍𝐒:

1️⃣ 📱 Profile Link: 
   https://www.facebook.com/profile.php?id=${OWNER_UID}

2️⃣ 💬 Direct Message: 
   https://m.me/${OWNER_UID}

3️⃣ 👤 Share Contact Card:
   (Bot will share contact below)

🔹 𝐓𝐈𝐏: Agar profile visible nahi hai, toh "Message" button use karein
`;

  // BOT DATA
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const messageText = `
━━━━━━━━━━━━━━━━━━
📍 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 📍
━━━━━━━━━━━━━━━━━━

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}

👤 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

👑 Bot Owner: ${ownerName}

${contactOptions}

━━━━━━━━━━━━━━━━━━
`;

  // 1️⃣ First send bot info with contact options
  api.sendMessage(messageText, event.threadID, async () => {
    // 2️⃣ Then send owner contact card
    return api.shareContact(
      `📇 Owner Contact: ${ownerName}`,
      OWNER_UID,
      event.threadID,
      async (err, info) => {
        if (err) return console.log("Contact share error:", err);

        // 3️⃣ Additional message for visibility help
        const visibilityMsg = `
✅ 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𝐕𝐈𝐒𝐈𝐁𝐈𝐋𝐈𝐓𝐘 𝐓𝐈𝐏𝐒:

1. Profile public rakhne ke liye:
   • Settings → Privacy → Profile Visibility → Public

2. Messenger me message receive karne ke liye:
   • Settings → Privacy → Message Delivery → Everyone

3. Agar profile dikhayi na de, toh m.me link use karein:
   https://m.me/${OWNER_UID}

📧 Response time: 24-48 hours
`;

        setTimeout(() => {
          api.sendMessage(visibilityMsg, event.threadID);
        }, 2000);

        // 4️⃣ Auto Unsend contact after 10 seconds (optional)
        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 10000);
      }
    );
  });
};
