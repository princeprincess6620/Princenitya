const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data"); // FIXED IMPORT

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

  try {
    if (!event.messageReply)
      return send("📸 Reply to photo & use:\n`.move video Hello`");

    const reply = event.messageReply;

    if (!reply.attachments || reply.attachments.length === 0)
      return send("❌ Please reply to a **photo**");

    const att = reply.attachments[0];
    if (att.type !== "photo")
      return send("❌ Only photo supported!");

    const text = args.join(" ").trim();
    if (!text) return send("❌ Use: `.move video Hello`");
    if (text.length > 100) return send("⚠ Max 100 characters allowed.");

    send(`🎬 Creating talking photo video...\n📝 "${text}"\n⏳ Please wait...`);
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const tmp = path.join(__dirname, "tmp_move_did");
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    const timestamp = Date.now();
    const files = {
      img: path.join(tmp, `img_${timestamp}.jpg`),
      audio: path.join(tmp, `audio_${timestamp}.mp3`)
    };

    // Download Image
    const imgRes = await axios.get(att.url, { responseType: "arraybuffer" });
    fs.writeFileSync(files.img, imgRes.data);

    // Generate Audio TTS
    const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
    const audioRes = await axios.get(ttsURL, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    fs.writeFileSync(files.audio, audioRes.data);

    // Prepare FormData
    const formData = new FormData();
    formData.append("image", fs.createReadStream(files.img));
    formData.append("audio", fs.createReadStream(files.audio));

    // API Call
    const apiURL = "https://aryan-d-id-video-api.onrender.com/generate";

    const response = await axios.post(apiURL, formData, {
      headers: {
        ...formData.getHeaders() // FIXED HEADERS
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 180000
    });

    if (!response.data.video_url)
      throw new Error("Invalid response: video_url missing");

    const videoFile = await axios.get(response.data.video_url, { responseType: "stream" });

    await api.sendMessage({
      body: `🎉 Talking Photo Ready\n📝 "${text}"`,
      attachment: videoFile.data
    }, event.threadID, event.messageID);

    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Process failed\nError: " + err.message, event.threadID);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};
