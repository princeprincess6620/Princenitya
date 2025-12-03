const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "movevideo",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Aryan | D-ID API",
  description: "Talking photo video using D-ID Render API",
  commandCategory: "media",
  usages: "reply photo + .move video [text]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

  try {

    if (!event.messageReply)
      return send("📸 Reply to a photo & use:\n`.move video Hello`");

    const reply = event.messageReply;

    if (!reply.attachments || reply.attachments.length === 0)
      return send("❌ Please reply to a **photo**");

    const attach = reply.attachments[0];
    if (attach.type !== "photo")
      return send("❌ Only photo supported");

    const text = args.join(" ").trim();
    if (!text) return send("❌ Add text: `.move video Hello`");
    if (text.length > 100) return send("⚠ Max 100 characters allowed");

    send(`🎬 Creating real talking photo video...\n📝 "${text}"\n⏳ Wait 10-15s...`);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    // TEMP FOLDER
    const tmp = path.join(__dirname, "move_temp_did");
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    const timestamp = Date.now();
    const files = {
      img: path.join(tmp, `img_${timestamp}.jpg`),
      audio: path.join(tmp, `audio_${timestamp}.mp3`)
    };

    // DOWNLOAD IMAGE
    const imgRes = await axios.get(attach.url, { responseType: "arraybuffer" });
    fs.writeFileSync(files.img, imgRes.data);

    // TTS AUDIO
    const tts = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
    const audioRes = await axios.get(tts, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    fs.writeFileSync(files.audio, audioRes.data);

    // SEND TO RENDER D-ID STYLE API
    const apiURL = "https://aryan-d-id-video-api.onrender.com/generate";

    const formData = new FormData();
    formData.append("image", fs.createReadStream(files.img));
    formData.append("audio", fs.createReadStream(files.audio));

    const response = await axios.post(apiURL, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000
    });

    if (!response.data.video_url)
      throw new Error("Video generation failed");

    // SEND FINAL VIDEO
    const videoStream = await axios.get(response.data.video_url, { responseType: "stream" });

    await api.sendMessage({
      body: `🎉 **Talking Photo Ready!**\n📝 "${text}"`,
      attachment: videoStream.data
    }, event.threadID, event.messageID);

    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (err) {
    console.error(err);
    send("❌ Process failed. Try again later.\nError: " + err.message);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};
