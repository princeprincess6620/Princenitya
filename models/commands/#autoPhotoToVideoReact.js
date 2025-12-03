const axios = require("axios");

module.exports.config = {
  name: "autoPhotoToVideoReact",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Auto convert photo to video",
  commandCategory: "media",
  usages: "[सिर्फ फोटो भेजें]",
  cooldowns: 30,
  dependencies: {
    "axios": ""
  }
};

module.exports.handleEvent = async function({ api, event }) {
  try {
    // सिर्फ फोटो मैसेज के लिए
    if (!event.message || !event.message.attachments || event.message.attachments.length === 0) return;
    
    const attachments = event.message.attachments;
    const photo = attachments.find(att => att.type === "photo" || att.type === "image");
    
    if (!photo) return; // अगर फोटो नहीं है तो रिटर्न
    
    console.log("फोटो डिटेक्ट हुई:", photo.url);
    
    // रिएक्शन जोड़ें
    try {
      await api.setMessageReaction("🎬", event.messageID, (err) => {}, true);
    } catch (e) {}
    
    // यूज़र को प्रोसेसिंग बताएं
    await api.sendMessage("🎬 फोटो को वीडियो में कन्वर्ट किया जा रहा है...", event.threadID, event.messageID);
    
    // API कॉल
    const response = await axios.post("https://api-aryan-d-id-video.onrender.com/generate", {
      image_url: photo.url
    }, {
      timeout: 60000 // 60 सेकंड timeout
    });
    
    if (response.data && response.data.videoUrl) {
      const videoStream = await global.utils.getStreamFromURL(response.data.videoUrl);
      
      // वीडियो भेजें
      await api.sendMessage({
        body: "✅ आपका वीडियो तैयार है!",
        attachment: videoStream
      }, event.threadID, event.messageID);
    } else {
      await api.sendMessage("❌ वीडियो बनाने में असफल। API ने कोई वीडियो URL नहीं दिया।", event.threadID, event.messageID);
    }
    
  } catch (error) {
    console.error("autoPhotoToVideoReact error:", error);
    try {
      await api.sendMessage(`❌ एरर: ${error.message}`, event.threadID, event.messageID);
    } catch (e) {}
  }
};

module.exports.run = async function({ api, event }) {
  await api.sendMessage("ℹ️ यह मॉड्यूल ऑटोमेटिक काम करता है। बस कोई फोटो भेजें और यह उसे वीडियो में बदल देगा।", event.threadID);
};
