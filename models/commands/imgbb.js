const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { downloadFile } = require("../../utils");

module.exports.config = {
  name: "imgbb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Upload Image/Video to imgbb.com",
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

  const filePath = path.join(__dirname, `cache/imgbb_${Date.now()}.${ext}`);

  try {
    await downloadFile(att.url, filePath);

    const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });

    api.sendMessage("⏳ Uploading to Imgbb…", threadID, messageID);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=ac2771c6abbfdfe4f78dc49cd717008c`,
      {
        image: imageBase64
      }
    );

    fs.unlinkSync(filePath);

    const link = res.data.data.url;

    return api.sendMessage(
      `✅ Uploaded Successfully (Imgbb):\n${link}`,
      threadID,
      messageID
    );

  } catch (e) {
    console.log("❌ Error:", e.message);
    return api.sendMessage("❌ Upload failed.", threadID, messageID);
  }
};
