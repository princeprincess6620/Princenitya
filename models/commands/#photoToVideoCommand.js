const axios = require("axios");

module.exports.config = {
  name: "photoToVideoCommand",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Convert photo to video when user types 'move video'",
  commandCategory: "media",
  usages: "Send 'move video' with a photo",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  try {
    // Check if message contains the command "move video"
    const messageText = event.message.text || "";
    if (!messageText.toLowerCase().includes("move video")) return;

    // Check if message has attachments
    if (!event.message.attachments || event.message.attachments.length === 0) {
      return api.sendMessage("📸 Please attach a photo along with 'move video'!", event.threadID, event.messageID);
    }

    // Get the first photo attachment
    const attachment = event.message.attachments.find(a => a.type === "photo");
    if (!attachment) return api.sendMessage("❌ No photo detected!", event.threadID, event.messageID);

    const photoUrl = attachment.url;

    // Call your video generation API
    const response = await axios.post("https://aryan-d-id-video-generator.onrender.com/generate", {
      imageUrl: photoUrl
    });

    if (!response.data || !response.data.videoUrl) {
      return api.sendMessage("❌ Failed to generate video.", event.threadID, event.messageID);
    }

    const videoUrl = response.data.videoUrl;

    // Send video back to group
    api.sendMessage({
      body: "🎬 Here's your video!",
      attachment: await global.utils.getStreamFromURL(videoUrl)
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Something went wrong while generating the video.", event.threadID, event.messageID);
  }
};
