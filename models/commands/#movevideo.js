const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "movevideo",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "Aryan | FIX by ChatGPT",
  description: "Talking photo video using Render D-ID API",
  commandCategory: "media",
  usages: "reply to photo + .move video [text]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  const cleanupFiles = []; // Track files for cleanup

  try {
    // Validate input
    if (!event.messageReply) {
      return send("📸 Please reply to a photo and use:\n`.move video [your text]`");
    }

    const reply = event.messageReply;

    // Check for attachments
    if (!reply.attachments || !reply.attachments[0]) {
      return send("❌ Please reply to a photo with an attachment.");
    }

    const attachment = reply.attachments[0];

    // Validate attachment type
    if (attachment.type !== "photo") {
      return send("❌ Only photos are supported! Please reply to an image.");
    }

    // Validate text input
    const text = args.join(" ").trim();
    if (!text) {
      return send("❌ Please provide text. Usage: `.move video Hello world`");
    }

    if (text.length > 100) {
      return send("⚠️ Maximum 100 characters allowed. Your text has " + text.length + " characters.");
    }

    // Send initial message
    send(`🎬 Creating talking photo video...\n📝 Text: "${text}"\n⏳ Please wait 15-20 seconds...`);
    api.setMessageReaction("⏳", event.messageID, () => { }, true);

    // Create temporary directory
    const tmpDir = path.join(__dirname, "tmp_move_did");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    const files = {
      image: path.join(tmpDir, `input_${timestamp}_${randomId}.jpg`),
      audio: path.join(tmpDir, `audio_${timestamp}_${randomId}.mp3`),
      video: path.join(tmpDir, `output_${timestamp}_${randomId}.mp4`)
    };

    // Add to cleanup list
    cleanupFiles.push(files.image, files.audio, files.video);

    // Step 1: Download image
    try {
      const imageResponse = await axios({
        method: 'GET',
        url: attachment.url,
        responseType: 'arraybuffer',
        timeout: 30000
      });

      if (!imageResponse.data || imageResponse.data.length === 0) {
        throw new Error("Failed to download image: Empty response");
      }

      fs.writeFileSync(files.image, imageResponse.data);
      console.log("✅ Image downloaded:", files.image);
    } catch (imageError) {
      throw new Error("Failed to download image: " + imageError.message);
    }

    // Step 2: Generate TTS audio
    try {
      const ttsResponse = await axios({
        method: 'GET',
        url: `https://translate.google.com/translate_tts`,
        params: {
          ie: 'UTF-8',
          client: 'tw-ob',
          tl: 'en',
          q: text,
          total: 1,
          idx: 0,
          textlen: text.length
        },
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });

      if (!ttsResponse.data || ttsResponse.data.length === 0) {
        throw new Error("Failed to generate audio: Empty response");
      }

      fs.writeFileSync(files.audio, ttsResponse.data);
      console.log("✅ Audio generated:", files.audio);
    } catch (ttsError) {
      throw new Error("Failed to generate audio: " + ttsError.message);
    }

    // Step 3: Prepare form data for API
    const formData = new FormData();
    formData.append('image', fs.createReadStream(files.image), {
      filename: 'photo.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('audio', fs.createReadStream(files.audio), {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg'
    });

    // Step 4: Call D-ID API
    console.log("🔄 Calling D-ID API...");
    const response = await axios({
      method: 'POST',
      url: 'https://aryan-d-id-video-api.onrender.com/generate',
      data: formData,
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000 // 2 minutes timeout
    });

    // Check API response
    if (!response.data || !response.data.video_url) {
      console.error("API Response:", response.data);
      throw new Error("API didn't return a video URL. Please try again.");
    }

    // Step 5: Download video
    console.log("📥 Downloading video from:", response.data.video_url);
    const videoResponse = await axios({
      method: 'GET',
      url: response.data.video_url,
      responseType: 'stream',
      timeout: 60000
    });

    // Save video temporarily
    const videoStream = fs.createWriteStream(files.video);
    videoResponse.data.pipe(videoStream);

    // Wait for download to complete
    await new Promise((resolve, reject) => {
      videoStream.on('finish', resolve);
      videoStream.on('error', reject);
    });

    console.log("✅ Video downloaded:", files.video);

    // Step 6: Send video
    await api.sendMessage({
      body: `✅ Talking Photo Video Created Successfully!\n\n📝 Text: "${text}"\n🎬 Enjoy your animated photo!`,
      attachment: fs.createReadStream(files.video)
    }, event.threadID, event.messageID);

    // Update reaction
    api.setMessageReaction("✅", event.messageID, () => { }, true);

  } catch (error) {
    console.error("❌ Error in movevideo command:", error);
    
    // Clean up files on error
    cleanupFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (cleanupError) {
          console.error("Failed to clean up file:", file, cleanupError.message);
        }
      }
    });

    let errorMessage = "❌ Process failed!\n";
    
    if (error.message.includes("timeout")) {
      errorMessage += "⏱️ Request timed out. The server might be busy.\nPlease try again in a few moments.";
    } else if (error.message.includes("network")) {
      errorMessage += "🌐 Network error. Please check your connection.";
    } else if (error.message.includes("API")) {
      errorMessage += "🔧 API service is temporarily unavailable.\nPlease try again later.";
    } else {
      errorMessage += "Error: " + error.message;
    }
    
    api.sendMessage(errorMessage, event.threadID, event.messageID);
    api.setMessageReaction("❌", event.messageID, () => { }, true);
    
  } finally {
    // Final cleanup after 5 seconds
    setTimeout(() => {
      cleanupFiles.forEach(file => {
        if (fs.existsSync(file)) {
          try {
            fs.unlinkSync(file);
            console.log("🧹 Cleaned up:", file);
          } catch (e) {
            // Silent fail for cleanup
          }
        }
      });
    }, 5000);
  }
};
