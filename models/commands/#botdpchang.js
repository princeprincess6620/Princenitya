const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "botdpchang",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "ChatGPT",
  description: "Sirf owner bot ki DP change kar sakta hai",
  commandCategory: "System",
  usages: "reply photo",
  cooldowns: 3
};

// 🔐 Yahan apna owner UID daalo
const OWNER_IDS = ["61584629226732"]; // <-- apna real FB UID lagao

module.exports.run = async function ({ api, event }) {

  // Owner check
  if (!OWNER_IDS.includes(event.senderID)) {
    return api.sendMessage("❌ Sirf owner hi bot ki DP change kar sakta hai!", event.threadID, event.messageID);
  }

  try {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return api.sendMessage("🔁 Kisi photo ko reply karo!", event.threadID, event.messageID);
    }

    const imgURL = event.messageReply.attachments[0].url;
    const path = __dirname + "/cache/botdp.jpg";

    // Photo download
    const imageBuffer = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(imageBuffer, "utf-8"));

    // DP change
    api.changeAvatar(fs.createReadStream(path), (err) => {
      if (err) {
        return api.sendMessage("❌ DP change failed!", event.threadID, event.messageID);
      }
      api.sendMessage("✅ Bot ki DP successfully change ho gayi!", event.threadID, event.messageID);
    });

  } catch (e) {
    api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
  }
};
