const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "fbid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Irfan",
  description: "Futuristic Facebook ID DP Generator",
  commandCategory: "ai",
  usages: "Reply an image with: fbid",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("⚠️ Please reply to a photo!", event.threadID, event.messageID);
  }

  const imageUrl = event.messageReply.attachments[0].url;
  const prompt = `
  A futuristic transparent digital ID card held in a hand, glowing neon blue edges, Facebook-style interface. Insert this person's face photo in the center, hologram effect, ultra-realistic portrait, neon reflections, cyber theme, 8K resolution.
  `;

  try {
    const response = await axios.post(
      "https://aryan-nitya-ai-api-chat-bot.onrender.com",
      {
        image: imageUrl,
        prompt: prompt
      },
      {
        responseType: "arraybuffer"
      }
    );

    const filePath = path.join(__dirname, "/cache/fbid.png");
    fs.writeFileSync(filePath, Buffer.from(response.data));

    api.sendMessage(
      {
        body: "✨ Here's your futuristic Facebook ID DP!",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );
  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Error generating image!", event.threadID);
  }
};
