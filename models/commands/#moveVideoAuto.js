const axios = require("axios");

module.exports.config = {
  name: "moveVideoAuto",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Convert photo to video when user types 'move video' with a photo",
  commandCategory: "media",
  usages: "Send 'move video' with a photo",
  cooldowns: 5
};

module.exports.run = async ({ api, event, global }) => {
  try {
    const messageText = (event.message && event.message.text) ? event.message.text : "";
    
    // Trigger only if message contains "move video"
    if (!/move\s+video/i.test(messageText)) return;

    // Check if attachments exist
    const attachments = event.message.attachments || [];
    if (attachments.length === 0) {
      return api.sendMessage("📸 Please attach a photo along with 'move video'!", event.threadID, event.messageID);
    }

    // Find photo attachment (adjust type if your framework uses "image" instead of "photo")
    const photoAttachment = attachments.find(a => a.type === "photo" || a.type === "image");
    if (!photoAttachment) {
      return api.sendMessage("❌ No photo detected!", event.threadID, event.messageID);
    }

    const photoUrl = photoAttachment.url;

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

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Something went wrong while generating the video.", event.threadID, event.messageID);
  }
};
