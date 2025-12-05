module.exports.config = {
  name: "noprefix",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Arif Babu & ChatGPT",
  description: "Auto trigger system without prefix + Owner Profile",
  commandCategory: "system",
  usages: "no prefix",
  cooldowns: 1
};

// Trigger words
const triggerWords = ["prefix", "help", "bot", "info", "hi bot", "hey bot"];

module.exports.handleEvent = async ({ api, event, Users }) => {
  const message = event.body?.toLowerCase() || "";
  const prefix = global.config.PREFIX;

  if (triggerWords.some(word => message.startsWith(word))) {

    // ===== OWNER PROFILE =====
    const ownerName = "ARIF BABU";
    const ownerUID = "61580003810694";  // Your UID added here
    const ownerProfileLink = `https://facebook.com/${ownerUID}`;
    const ownerAvatar = `https://graph.facebook.com/${ownerUID}/picture?width=720&height=720`;

    const totalUsers = global.data.allUserID.length;
    const totalThreads = global.data.allThreadID.length;

    const reply = `
━━━━━━━━━━━━━━━━━━
🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎  
━━━━━━━━━━━━━━━━━━

👋 Hi ${await Users.getNameUser(event.senderID)}!
🔧 Prefix: ${prefix}
📚 Commands: ${global.client.commands.size}

👤 Total Users: ${totalUsers}
💬 Total Threads: ${totalThreads}

━━━━━━━━━━━━━━━━━━
👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎
━━━━━━━━━━━━━━━━━━
✨ Name: ${ownerName}
🆔 UID: ${ownerUID}
🔗 Profile: ${ownerProfileLink}
━━━━━━━━━━━━━━━━━━
`;

    api.sendMessage(
      {
        body: reply,
        attachment: await global.utils.getStreamFromURL(ownerAvatar)
      },
      event.threadID,
      event.messageID
    );
  }
};

module.exports.run = () => {};
