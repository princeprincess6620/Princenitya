const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "movevideo",
  version: "4.2.0",
  hasPermssion: 0,
  credits: "Aryan | FIX by ChatGPT",
  description: "Talking photo video using D-ID API",
  commandCategory: "media",
  usages: "reply to photo + .move video [text]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  const cleanupFiles = [];

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
      audio: path.join(tmpDir, `audio_${timestamp}_${randomId}.mp3`)
    };

    cleanupFiles.push(files.image, files.audio);

    // Step 1: Download image
    try {
      const imageResponse = await axios({
        method: 'GET',
        url: attachment.url,
        responseType: 'arraybuffer',
        timeout: 30000
      });

      if (!imageResponse.data || imageResponse.data.length === 0) {
        throw new Error("Failed to download image");
      }

      fs.writeFileSync(files.image, imageResponse.data);
      console.log("✅ Image downloaded");
    } catch (imageError) {
      throw new Error("Failed to download image: " + imageError.message);
    }

    // Step 2: Generate TTS audio (alternative method if needed)
    try {
      // Try using a reliable TTS service
      const ttsResponse = await axios({
        method: 'GET',
        url: `https://api.streamelements.com/kappa/v2/speech`,
        params: {
          voice: 'Brian',
          text: text
        },
        responseType: 'arraybuffer',
        timeout: 30000
      });

      if (!ttsResponse.data || ttsResponse.data.length === 0) {
        throw new Error("Failed to generate audio from first service");
      }

      fs.writeFileSync(files.audio, ttsResponse.data);
      console.log("✅ Audio generated");
    } catch (ttsError) {
      console.log("TTS Service 1 failed, trying backup...");
      
      // Backup TTS service
      try {
        const backupTTS = await axios({
          method: 'GET',
          url: `https://tts-api.project-tx.ml/api/tts`,
          params: {
            text: text,
            voice: 'en_US'
          },
          responseType: 'arraybuffer',
          timeout: 30000
        });
        
        fs.writeFileSync(files.audio, backupTTS.data);
        console.log("✅ Audio generated from backup");
      } catch (backupError) {
        throw new Error("All TTS services failed");
      }
    }

    // Step 3: Try multiple API endpoints
    const apiEndpoints = [
      {
        name: "D-ID Alternative",
        url: "https://talking-photo-api.onrender.com/generate",
        method: "POST"
      },
      {
        name: "Photo Animation API",
        url: "https://photo-animate-api.onrender.com/animate",
        method: "POST"
      },
      {
        name: "Talkify API",
        url: "https://talkify-api.vercel.app/create",
        method: "POST"
      }
    ];

    let videoUrl = null;
    let successfulApi = null;

    for (const apiConfig of apiEndpoints) {
      try {
        console.log(`🔄 Trying API: ${apiConfig.name}`);
        
        const formData = new FormData();
        formData.append('image', fs.createReadStream(files.image), {
          filename: 'photo.jpg',
          contentType: 'image/jpeg'
        });
        formData.append('audio', fs.createReadStream(files.audio), {
          filename: 'audio.mp3',
          contentType: 'audio/mpeg'
        });

        if (apiConfig.name === "Talkify API") {
          // This API might need different parameters
          formData.append('text', text);
        }

        const response = await axios({
          method: apiConfig.method,
          url: apiConfig.url,
          data: formData,
          headers: {
            ...formData.getHeaders(),
            'Accept': 'application/json'
          },
          timeout: 45000, // 45 seconds per API
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });

        console.log(`Response from ${apiConfig.name}:`, response.data);

        if (response.data && (response.data.video_url || response.data.url || response.data.result)) {
          videoUrl = response.data.video_url || response.data.url || response.data.result;
          successfulApi = apiConfig.name;
          console.log(`✅ ${apiConfig.name} succeeded!`);
          break;
        }
      } catch (apiError) {
        console.log(`❌ ${apiConfig.name} failed:`, apiError.message);
        continue; // Try next API
      }
    }

    if (!videoUrl) {
      // If all APIs fail, try a fallback method using local processing
      throw new Error("All animation APIs are currently unavailable. Please try again later.");
    }

    // Step 4: Download video
    console.log(`📥 Downloading video from ${successfulApi}:`, videoUrl);
    
    try {
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const videoPath = path.join(tmpDir, `output_${timestamp}_${randomId}.mp4`);
      const videoStream = fs.createWriteStream(videoPath);
      videoResponse.data.pipe(videoStream);

      await new Promise((resolve, reject) => {
        videoStream.on('finish', resolve);
        videoStream.on('error', reject);
      });

      cleanupFiles.push(videoPath);
      console.log("✅ Video downloaded successfully");

      // Step 5: Send video
      await api.sendMessage({
        body: `✅ Talking Photo Video Created Successfully!\n\n📝 Text: "${text}"\n🔧 Using: ${successfulApi}\n🎬 Enjoy your animated photo!`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

      api.setMessageReaction("✅", event.messageID, () => { }, true);

    } catch (videoError) {
      throw new Error(`Failed to download video: ${videoError.message}`);
    }

  } catch (error) {
    console.error("❌ Error in movevideo command:", error);
    
    // Clean up files
    cleanupFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      }
    });

    let errorMessage = "❌ Process failed!\n";
    
    if (error.message.includes("timeout")) {
      errorMessage += "⏱️ Request timed out. Server might be busy.\nTry again in a minute.";
    } else if (error.message.includes("unavailable")) {
      errorMessage += "🔧 Animation services are temporarily down.\nPlease try again later or use a different command.";
    } else if (error.message.includes("404") || error.message.includes("not found")) {
      errorMessage += "🌐 API endpoint not found.\nThe service might have changed or is offline.";
    } else {
      errorMessage += `Error: ${error.message}`;
    }
    
    api.sendMessage(errorMessage, event.threadID, event.messageID);
    api.setMessageReaction("❌", event.messageID, () => { }, true);
    
  } finally {
    // Final cleanup
    setTimeout(() => {
      cleanupFiles.forEach(file => {
        if (fs.existsSync(file)) {
          try {
            fs.unlinkSync(file);
          } catch (e) {
            // Silent cleanup
          }
        }
      });
      
      // Clean old files in tmp directory
      const tmpDir = path.join(__dirname, "tmp_move_did");
      if (fs.existsSync(tmpDir)) {
        try {
          const files = fs.readdirSync(tmpDir);
          const now = Date.now();
          files.forEach(file => {
            const filePath = path.join(tmpDir, file);
            const stats = fs.statSync(filePath);
            // Delete files older than 5 minutes
            if (now - stats.mtimeMs > 5 * 60 * 1000) {
              fs.unlinkSync(filePath);
            }
          });
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }, 10000);
  }
};
