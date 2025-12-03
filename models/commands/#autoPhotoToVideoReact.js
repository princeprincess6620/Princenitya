const axios = require("axios");

module.exports.config = {
  name: "autoPhotoToVideoReact",
  version: "1.0.6",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Automatically convert photo to video and react with emoji",
  commandCategory: "media",
  usages: "Just send a photo",
  cooldowns: 5
};

module.exports.run = async ({ api, event, global }) => {
  try {
    // Extract attachments
    const attachments = event.message?.attachments || [];

    // Find the first photo attachment
    const photoAttachment = attachments.find(a => a.type === "photo" || a.type === "image");
    if (!photoAttachment) return; // Exit silently if no photo is found

    const photoUrl = photoAttachment.url;

    // React to user's message with 🎬
    if (typeof api.setMessageReaction === "function") {
      try {
        await api.setMessageReaction("🎬", event.messageID, event.threadID, true);
      } catch (reactErr) {
        console.error("Failed to add reaction:", reactErr);
      }
    }

    // Call the updated API
    const response = await axios.post("https://api-aryan-d-id-video.onrender.com/generate", {
      image_url: photoUrl  // Make sure the API expects "image_url" as the key
    });

    // Check if video URL exists
    if (!response.data?.videoUrl) {
      return api.sendMessage("❌ Failed to generate video.", event.threadID, event.messageID);
    }

    const videoUrl = response.data.videoUrl;

    // Send the generated video back
    api.sendMessage({
      body: "🎬 Here's your video!",
      attachment: await global.utils.getStreamFromURL(videoUrl)
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Something went wrong while generating the video.", event.threadID, event.messageID);
  }
};
