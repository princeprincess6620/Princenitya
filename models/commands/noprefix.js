module.exports.config = {
  name: "noprefix",
  version: "1.0",
  hasPermssion: 0,
  credits: "Final Fix",
  description: "Exact screenshot jaisa + real owner profile pic",
  commandCategory: "no prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID()) return;
  if (!event.body) return;

  const ownerID = "61580003810694"; // Tumhara real FB ID

  // Real profile picture (high quality + latest wala)
  const ownerPic = `https://graph.facebook.com/${ownerID}/picture?type=large&width=720&height=720&access_token=EAAGNO4a7r2wBAJqZCzG...`; 
  // Agar upar wala token expire ho jaye toh neeche wala use kar lena (permanent working)
  const fallbackPic = `https://graph.facebook.com/${ownerID}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

  const botID = api.getCurrentUserID();

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

  // Pehle real photo try karega, nahi aayi toh fallback
  let photoStream;
  try {
    photoStream = (await global.nodemodule["axios"].get(ownerPic, { responseType: "stream" })).data;
  } catch (err) {
    photoStream = (await global.nodemodule["axios"].get(fallbackPic, { responseType: "stream" })).data;
  }

  // Main message with real photo + mention
  api.sendMessage({
    body: body,
    mentions: [{ tag: "@NITYA K...", id: ownerID }],
    attachment: photoStream
  }, event.threadID, event.messageID);

  // Exact same buttons
  api.sendMessage({
    body: "",
    attachment: [],
    buttons: [
      { type: "postback", title: "Profile", payload: "OWNER_PROFILE" },
      { type: "postback", title: "Message", payload: "OWNER_MESSAGE" }
    ]
  }, event.threadID);
};

module.exports.run = () => {};
