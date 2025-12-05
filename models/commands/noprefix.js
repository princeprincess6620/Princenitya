// File name: noprefix.js (commands folder mein daal do)

module.exports.config = {
  name: "noprefix",
  version: "2.0",
  hasPermssion: 0,
  credits: "Modified by Grok",
  description: "Exact same bot info auto reply",
  commandCategory: "no prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event, Users, Threads }) {
  if (event.senderID === api.getCurrentUserID()) return;
  if (event.body == null) return;

  const ownerID = "61580003810694"; // ← Tumhara exact FB ID
  const botID = api.getCurrentUserID();

  const ownerAvatar = `https://graph.facebook.com/${ownerID}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
  const botAvatar = `https://graph.facebook.com/${botID}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

  const msg = {
    body: `┌────[ BOT INFORMATION ]────┐

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
          ♪ ✧ ˖°🎧 +)`,

    mentions: [{
      tag: "@NITYA K...",
      id: ownerID
    }],

    attachment: [
      await global.nodemodule["axios"].get(ownerAvatar, { responseType: "stream" }).then(res => res.data),
      await global.nodemodule["axios"].get(botAvatar, { responseType: "stream" }).then(res => res.data)
    ]
  };

  api.sendMessage(msg, event.threadID, event.messageID);

  // Buttons exactly same jaise screenshot mein hain
  api.sendMessage({
    body: " ",
    attachment: [],
    buttons: [
      { type: "postback", title: "Profile", payload: "OWNER_PROFILE" },
      { type: "postback", title: "Message", payload: "OWNER_MESSAGE" }
    ]
  }, event.threadID);
};

module.exports.run = () => {};
