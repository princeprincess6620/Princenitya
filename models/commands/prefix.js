const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "prefix",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "ARYAN",
  description: "Show bot information summary",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {

  const prefix = global.config.PREFIX;

  // OWNER DATA
  const OWNER_UID = "61580003810694"; // change if needed
  const ownerName = "ARYAN";

  const fbProfile = `https://www.facebook.com/profile.php?id=${OWNER_UID}`;
  const inbox = `https://m.me/${OWNER_UID}`;

  // BOT DATA
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const cmds = global.client.commands.size;

  const msg = `
╔══════✦❘༻ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ༺❘✦══════╗

👋 Hi ${await Users.getNameUser(event.senderID)}!

🤖 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚: ${global.config.BOTNAME}
🆔 𝘽𝙤𝙩 𝙄𝘿: ${api.getCurrentUserID()}

🔧 𝙋𝙧𝙚𝙛𝙞𝙭: ${prefix}
📦 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨: ${cmds}
👥 𝙏𝙤𝙩𝙖𝙡 𝙐𝙨𝙚𝙧𝙨: ${totalUsers}
💬 𝙏𝙤𝙩𝙖𝙡 𝙏𝙝𝙧𝙚𝙖𝙙𝙨: ${totalThreads}

👑 𝘽𝙤𝙩 𝙊𝙬𝙣𝙚𝙧: ${ownerName}
🆔 𝙐𝙄𝘿: ${OWNER_UID}

╚══════════════════════╝
📨 Buttons below to contact owner
`;

  api.sendMessage({
    body: msg,
    attachment: null,
    mentions: [{
      tag: ownerName,
      id: OWNER_UID
    }],
    messageReply: event.messageID,
    augmentations: {
      attachments: [
        {
          type: "template",
          payload: {
            template_type: "button",
            text: `👑 Owner: ${ownerName}`,
            buttons: [
              { type: "web_url", url: fbProfile, title: "🌐 Profile" },
              { type: "web_url", url: inbox, title: "💬 Message" }
            ]
          }
        }
      ]
    }
  }, event.threadID);
};
