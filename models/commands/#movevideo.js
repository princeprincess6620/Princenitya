const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
  name: "movevideo",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Reply to a photo with .move video <text> to create an AI avatar video",
  commandCategory: "media",
  usages: ".move video Hello!",
  cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const RENDER_API = process.env.DID_API_URL || 'https://api-aryan-d-id-video.onrender.com';
    const tmpDir = path.join(__dirname, 'tmp_movevideo');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const send = msg => api.sendMessage(msg, event.threadID);

    const fullText = args.join(" ").trim();
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return send("❌ Photo par reply karke command use karein:\n.move video Namaste!");
    }

    const attachment = event.messageReply.attachments.find(a =>
      (a.type && a.type === "photo") ||
      (a.url && a.url.match(/\.(jpg|jpeg|png|webp|bmp)$/i))
    );

    if (!attachment) return send("❌ Ye command sirf photo reply par chalti hai.");
    if (!fullText) return send("❌ Text missing! Example: .move video Namaste!");

    const imageUrl = attachment.url;
    await send("⏳ Video banaya ja raha hai, thoda wait karein...");

    // 🔥 Auto Reaction on Photo
    api.setMessageReaction("😍", event.messageID, () => {}, true);

    // Download Image
    const imageFilename = path.join(tmpDir, `input_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imageFilename);
    const resp = await axios.get(imageUrl, { responseType: "stream" });
    await new Promise((res, rej) => {
      resp.data.pipe(writer);
      writer.on("error", rej);
      writer.on("close", res);
    });

    // Upload
    const form = new FormData();
    form.append("image", fs.createReadStream(imageFilename));
    const uploadResp = await axios.post(`${RENDER_API}/upload`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    });

    const imageId = uploadResp.data.id;

    // Create Video
    const createResp = await axios.post(`${RENDER_API}/create`, {
      image_id: imageId,
      text: fullText,
      voice: "hi-IN-MadhurNeural",
      config: { fluent: true, pad_audio: 0.0 }
    });

    const videoId = createResp.data.id;
    let videoUrl = null;

    for (let i = 0; i < 12; i++) {
      const statusResp = await axios.get(`${RENDER_API}/video/${videoId}`);
      if (statusResp.data.url) {
        videoUrl = statusResp.data.url;
        break;
      }
      await new Promise(r => setTimeout(r, 5000));
    }

    if (!videoUrl) return send("❌ Video ready nahi hua, thodi der baad try karein.");

    // Download video
    const output = path.join(tmpDir, `out_${Date.now()}.mp4`);
    const videoResp = await axios.get(videoUrl, { responseType: "stream" });
    const outWriter = fs.createWriteStream(output);
    await new Promise((res, rej) => {
      videoResp.data.pipe(outWriter);
      outWriter.on("error", rej);
      outWriter.on("finish", res);
    });

    // Send video
    await api.sendMessage({ attachment: fs.createReadStream(output) }, event.threadID);

    // Reaction on success
    api.setMessageReaction("👍", event.messageID, () => {}, true);

    fs.unlinkSync(imageFilename);
    fs.unlinkSync(output);

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error: " + e.message, event.threadID);
    api.setMessageReaction("😢", event.messageID, () => {}, true);
  }
};
