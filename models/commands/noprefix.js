module.exports.config = {
  name: "noprefix",
  version: "1.0",
  hasPermssion: 0,
  credits: "Aryan Owliix",
  description: "Exact stylish owner card with real FB profile",
  commandCategory: "no prefix",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID()) return;

  const ownerID = "61580003810694"; // ← Tumhara real FB ID
  const ownerName = "Ārŷāŋ Owl||x°"; // ← Tumhara exact stylish FB name daal do (jo profile pe dikhta hai)

  // Real profile picture (yeh hamesha latest wala lata hai)
  const ownerPic = `https://graph.facebook.com/${ownerID}/picture?type=large&width=1080&height=1080&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

  const text = `Trust Me Baby♡ I Will  Break Your Heart━━━♡
${ownerName}

  +   +  ️ +`;

  api.sendMessage({
    body: text,
    mentions: [{ tag: ownerName, id: ownerID }],
    attachment: await global.nodemodule["axios"].get(ownerPic, { responseType: "stream" }).then(res => res.data)
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
