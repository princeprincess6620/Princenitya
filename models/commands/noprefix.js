module.exports.config = {
  name: "noprefix",
  version: "1.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Real owner photo guaranteed",
  commandCategory: "nono prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID()) return;

  const ownerID = "61580003810694";  // ← Tumhara ID
  const botID = api.getCurrentUserID();

  // Yeh URL hamesha tumhara latest real photo hi deta hai (public token se)
  const ownerPhotoURL = "https://graph.facebook.com/61580003810694/picture?type=large&width=1080&height=1080&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";

  const body = `[ BOT INFORMATION ]

Hi Kael Draven!

Bot Name: FB Bot
Bot ID: ${botID}
Prefix: /
Commands: 140 (407 with aliases)
Total Users: 6648
Total Threads: 53

Try typing "/help" to see available commands!

Bot Owner:

Tust Me Baby I Will Break Your Heart
@NITYA K...`;

  // Real photo attach karo
  const photo = (await global.nodemodule["axios"].get(ownerPhotoURL, { responseType: "stream" })).data;

  api.sendMessage({
    body: body,
    mentions: [{ tag: "@NITYA K...", id: ownerID }],
    attachment: photo
  }, event.threadID, event.messageID);

  // Buttons
  api.sendMessage({
    body: "",
    buttons: [
      { type: "postback", title: "Profile", payload: "PROFILE" },
      { type: "postback", title: "Message", payload: "MESSAGE" }
    ]
  }, event.threadID);
};

module.exports.run = () => {};
