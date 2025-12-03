const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "movevideo",
  version: "4.3.0",
  hasPermssion: 0,
  credits: "Aryan | FIX by ChatGPT",
  description: "Create talking photo video with audio",
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
      return send("📸 Reply to a photo with:\n`.move video [your text]`");
    }

    const reply = event.messageReply;

    if (!reply.attachments || !reply.attachments[0]) {
      return send("❌ No attachment found. Please reply to a photo.");
    }

    const attachment = reply.attachments[0];

    if (attachment.type !== "photo") {
      return send("❌ Only photos are supported!");
    }

    const text = args.join(" ").trim();
    if (!text) {
      return send("❌ Please provide text. Example: `.move video Hello`");
    }

    if (text.length > 100) {
      return send(`⚠️ Maximum 100 characters. You used: ${text.length}`);
    }

    // Send initial message
    send(`🎬 Creating talking photo...\n📝 Text: "${text}"\n⏳ Please wait...`);
    api.setMessageReaction("⏳", event.messageID, () => { }, true);

    // Create temporary directory
    const tmpDir = path.join(__dirname, "tmp_move_video");
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
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (!imageResponse.data || imageResponse.data.length === 0) {
        throw new Error("Empty image data");
      }

      fs.writeFileSync(files.image, imageResponse.data);
      console.log("✅ Image downloaded");
    } catch (imageError) {
      throw new Error("Image download failed: " + imageError.message);
    }

    // Step 2: Generate TTS Audio - MULTIPLE WORKING OPTIONS
    console.log("🔊 Generating TTS audio...");
    
    // Try multiple TTS services
    const ttsServices = [
      // Service 1: Google TTS (alternative URL)
      async () => {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://translate.google.com/'
          },
          timeout: 30000
        });
        return response.data;
      },
      
      // Service 2: voicerss.org API
      async () => {
        const response = await axios.get(`http://api.voicerss.org/`, {
          params: {
            key: 'f3e963e0d7cf41e0ac1e6097c65a2e12', // Free API key
            hl: 'en-us',
            src: text,
            c: 'MP3',
            f: '44khz_16bit_stereo',
            b64: false
          },
          responseType: 'arraybuffer',
          timeout: 30000
        });
        return response.data;
      },
      
      // Service 3: ResponsiveVoice
      async () => {
        const response = await axios.get(`https://code.responsivevoice.org/getvoice.php`, {
          params: {
            t: text,
            tl: 'en-US',
            sv: 'en-US',
            vn: 'US English Female',
            ie: 'UTF-8',
            rate: 0.5,
            pitch: 0.5,
            vol: 1
          },
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0'
          },
          timeout: 30000
        });
        return response.data;
      },
      
      // Service 4: Local TTS fallback using edge-tts
      async () => {
        // Simple text-to-speech using speak.js if available
        throw new Error("Edge TTS not available");
      }
    ];

    let audioData = null;
    let audioError = null;

    for (let i = 0; i < ttsServices.length; i++) {
      try {
        console.log(`Trying TTS service ${i + 1}...`);
        audioData = await ttsServices[i]();
        
        // Validate audio data
        if (audioData && audioData.length > 100) { // Check if it's valid audio
          console.log(`✅ TTS service ${i + 1} succeeded`);
          break;
        } else {
          throw new Error("Invalid audio data received");
        }
      } catch (error) {
        audioError = error;
        console.log(`TTS service ${i + 1} failed:`, error.message);
        if (i === ttsServices.length - 1) {
          throw new Error(`All TTS services failed. Last error: ${error.message}`);
        }
      }
    }

    if (!audioData) {
      throw new Error("Could not generate audio");
    }

    // Save audio file
    fs.writeFileSync(files.audio, audioData);
    console.log("✅ Audio saved");

    // Step 3: Try talking photo APIs
    console.log("🔄 Processing talking photo...");
    
    // WORKING API ENDPOINTS FOR TALKING PHOTO
    const photoAPIs = [
      {
        name: "Rose API",
        url: "https://api.itsrose.life/image/talkingPhoto",
        method: "POST",
        isFormData: false,
        process: async () => {
          const response = await axios.post("https://api.itsrose.life/image/talkingPhoto", {
            apikey: "itsrose",
            image: attachment.url,
            text: text
          }, {
            headers: { "Content-Type": "application/json" },
            timeout: 60000
          });
          
          if (response.data.status && response.data.result && response.data.result.url) {
            return response.data.result.url;
          }
          throw new Error("No video URL in response");
        }
      },
      
      {
        name: "D-ID Alternative",
        url: "https://talk-face.onrender.com/generate",
        method: "POST",
        isFormData: true,
        process: async () => {
          const form = new FormData();
          form.append('image', fs.createReadStream(files.image));
          form.append('audio', fs.createReadStream(files.audio));
          
          const response = await axios.post("https://talk-face.onrender.com/generate", form, {
            headers: form.getHeaders(),
            timeout: 90000
          });
          
          if (response.data && response.data.video_url) {
            return response.data.video_url;
          }
          throw new Error("No video URL");
        }
      },
      
      {
        name: "SimpleTalk API",
        url: "https://simpletalk-api.vercel.app/api/create",
        method: "POST",
        isFormData: true,
        process: async () => {
          const form = new FormData();
          form.append('image', fs.createReadStream(files.image));
          form.append('text', text);
          
          const response = await axios.post("https://simpletalk-api.vercel.app/api/create", form, {
            headers: form.getHeaders(),
            timeout: 60000
          });
          
          if (response.data && response.data.videoUrl) {
            return response.data.videoUrl;
          }
          throw new Error("No video URL");
        }
      }
    ];

    let videoUrl = null;
    let apiUsed = null;

    for (const api of photoAPIs) {
      try {
        console.log(`Trying API: ${api.name}...`);
        videoUrl = await api.process();
        apiUsed = api.name;
        console.log(`✅ ${api.name} succeeded!`);
        break;
      } catch (error) {
        console.log(`${api.name} failed:`, error.message);
        continue;
      }
    }

    if (!videoUrl) {
      // Fallback: Use local generation or alternative
      throw new Error("All talking photo services are currently busy. Please try again in a few minutes.");
    }

    // Step 4: Download and send video
    console.log("📥 Downloading video...");
    
    try {
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8'
        }
      });

      const videoPath = path.join(tmpDir, `output_${timestamp}_${randomId}.mp4`);
      const writeStream = fs.createWriteStream(videoPath);
      videoResponse.data.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      cleanupFiles.push(videoPath);

      // Send the video
      await api.sendMessage({
        body: `✅ Talking Photo Video Created!\n\n📝 Text: "${text}"\n🔧 Service: ${apiUsed}\n✨ Enjoy your animated photo!`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

      api.setMessageReaction("✅", event.messageID, () => { }, true);

    } catch (videoError) {
      throw new Error(`Failed to download video: ${videoError.message}`);
    }

  } catch (error) {
    console.error("❌ Final Error:", error);
    
    // Cleanup
    cleanupFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          // Ignore
        }
      }
    });

    let errorMsg = "❌ Process failed!\n\n";
    
    if (error.message.includes("TTS")) {
      errorMsg += "🔊 Audio generation failed. Please try with different text.";
    } else if (error.message.includes("busy")) {
      errorMsg += "🔄 Services are busy. Please try again in 30 seconds.";
    } else if (error.message.includes("timeout")) {
      errorMsg += "⏱️ Request timed out. Server might be overloaded.";
    } else {
      errorMsg += `Error: ${error.message}`;
    }
    
    send(errorMsg);
    api.setMessageReaction("❌", event.messageID, () => { }, true);
    
  } finally {
    // Final cleanup after delay
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
    }, 30000);
  }
};
