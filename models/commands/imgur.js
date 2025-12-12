const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { downloadFile } = require("../../utils");

module.exports.config = {
  name: "imgur",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Upload Image/Video (no API key required)",
  commandCategory: "Utilities",
  usages: "[reply media]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { type, messageReply, threadID, messageID } = event;

  if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("⚠ Reply to an image/video!", threadID, messageID);
  }

  const att = messageReply.attachments[0];

  const ext =
    att.type === "photo" ? "jpg" :
    att.type === "video" ? "mp4" :
    att.type === "animated_image" ? "gif" :
    att.type === "audio" ? "m4a" : "dat";

  const filePath = path.join(__dirname, `cache/imgur_${Date.now()}.${ext}`);

  try {
    await downloadFile(att.url, filePath);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(filePath));

    api.sendMessage("⏳ Uploading to Imgur… (Catbox backend)", threadID, messageID);

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(filePath);

    return api.sendMessage(`✅ Uploaded Successfully:\n${res.data}`, threadID, messageID);

  } catch (e) {
    console.log("❌ Error:", e.message);
    return api.sendMessage("❌ Upload failed.", threadID, messageID);
  }
};
