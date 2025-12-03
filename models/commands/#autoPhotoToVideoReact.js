const axios = require("axios");

module.exports.config = {
  name: "autoPhotoToVideoReact",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Automatically convert photo to video and react with emoji",
  commandCategory: "media",
  usages: "Just send a photo",
  cooldowns: 5
};

module.exports.run = async ({ api, event, global }) => {
  try {
    const attachments = event.message && event.message.attachments ? event.message.attachments : [];

    // Check if photo exists
    const photoAttachment = attachments.find(a => a.type === "photo" || a.type === "image");
    if (!photoAttachment) return; // Silently exit if no photo

    const photoUrl = photoAttachment.url;

    // React to the user's message with 🎬
    if (typeof api.setMessageReaction === "function") {
      try {
        await api.setMessageReaction("🎬", event.messageID, event.threadID, true);
      } catch (reactErr) {
        console.error("Reaction failed:", reactErr);
      }
    }

    // Call the D-ID video generation API
    const response = await axios.post("https://aryan-d-id-video-generator.onrender.com/generate", {
      imageUrl: photoUrl
    });

    if (!response.data || !response.data.videoUrl) {
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
