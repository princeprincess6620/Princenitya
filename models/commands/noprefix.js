module.exports.config = {
  name: "noprefix",
  version: "1.0",
  hasPermssion: 0,
  credits: "Priyanshu",
  description: "Auto reply with bot info - no prefix needed",
  commandCategory: "no prefix",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  if (event.body == null) return;
  if (event.senderID === api.getCurrentUserID()) return;

  const axios = require("axios");
  
  // Tumhara Facebook ID (jo diya tune)
  const ownerID = "61580003810694";
  
  const botID = api.getCurrentUserID();

  // Owner aur Bot ka Avatar
  const ownerAvatar = `https://graph.facebook.com/${ownerID}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
  const botAvatar = `https://graph.facebook.com/${botID}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

  const info = `
┌────[ BOT INFORMATION ]────┐

👋 Hi Kael Draven!

🤖 Bot Name: FB Bot
🆔 Bot ID: ${botID}
🔧 Prefix: /
📚 Commands: 140 (407 with aliases)
👥 Total Users: 6648
💬 Total Threads: 53

💡 Try typing "/help" to see available commands!

👑 Bot Owner:

Tust Me Baby♡ I Will 🌟✨Break Your Heart━━━━━♡ | 🖤 @NITYA K...
          ♪ ✧ ˖°🎧 +)

  `.trim();

  // Pehla message (text + dono photos + tag)
  api.sendMessage({
    body: info,
    mentions: [{
      tag: "@NITYA K...",
      id: ownerID
    }],
    attachment: [
      await global.nodemodule["axios"].get(ownerAvatar, { responseType: "stream" }).then(r => r.data),
      await global.nodemodule["axios"].get(botAvatar, { responseType: "stream" }).then(r => r.data)
    ]
  }, event.threadID, event.messageID);

  // Buttons wala message (Profile + Message)
  api.sendMessage({
    body: " ",
    attachment: [],
    buttons: [
      {
        type: "postback",
        title: "Profile",
        payload: "OWNER_PROFILE"
      },
      {
        type: "postback",
        title: "Message",
        payload: "OWNER_MESSAGE"
      }
    ]
  }, event.threadID, () => {}, event.messageID);
};

module.exports.run = function() {};
