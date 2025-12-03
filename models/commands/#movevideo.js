const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
  name: "movevideo",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Reply a photo with .move video <text> to generate AI video",
  commandCategory: "media",
  usages: ".move video Hello!",
  cooldowns: 8
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const RENDER_API = "https://aryan-d-id-video-api.onrender.com";
    const tmpDir = path.join(__dirname, "tmp_movevideo");

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const send = msg => api.sendMessage(msg, event.threadID);
    const text = args.join(" ").trim();

    if (!event.messageReply || !event.messageReply.attachments)
      return send("❌ Reply a photo and type: .move video Hello!");

    const attachment = event.messageReply.attachments[0];
    const imageUrl = attachment.url;

    if (!imageUrl) return send("❌ Image URL not found, try again.");
    if (!text) return send("❌ Please enter text. Example: .move video Namaste!");

    send("⏳ Processing your request...");

    // Auto react to message
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    // Download Image
    const imgFile = path.join(tmpDir, `img_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imgFile);
    const response = await axios.get(imageUrl, { responseType: "stream" });

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("error", reject);
      writer.on("close", resolve);
    });

    // Upload to API
    const form = new FormData();
    form.append("file", fs.createReadStream(imgFile));

    const upload = await axios.post(`${RENDER_API}/upload`, form, {
      headers: form.getHeaders()
    });

    const imageId = upload.data.id;

    // Create video request
    const create = await axios.post(`${RENDER_API}/process`, {
      image_id: imageId,
      text,
      voice: "hi-IN-MadhurNeural"
    });

    const videoId = create.data.id;
    let videoUrl = null;

    // Poll result
    for (let i = 0; i < 14; i++) {
      const check = await axios.get(`${RENDER_API}/result/${videoId}`);
      if (check.data.url) {
        videoUrl = check.data.url;
        break;
      }
      await new Promise(r => setTimeout(r, 5000));
    }

    if (!videoUrl) return send("❌ Video generation timeout. Try again later.");

    // Download final video
    const videoPath = path.join(tmpDir, `out_${Date.now()}.mp4`);
    const videoResp = await axios.get(videoUrl, { responseType: "stream" });
    const vWriter = fs.createWriteStream(videoPath);

    await new Promise((resolve, reject) => {
      videoResp.data.pipe(vWriter);
      vWriter.on("error", reject);
      vWriter.on("finish", resolve);
    });

    // Send back video
    await api.sendMessage({ attachment: fs.createReadStream(videoPath) }, event.threadID);

    // Final reaction
    api.setMessageReaction("✔️", event.messageID, () => {}, true);

    // Cleanup
    fs.unlinkSync(imgFile);
    fs.unlinkSync(videoPath);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error: " + err.message, event.threadID);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};
