const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

async function downloadFile(url, filePath) {
  const res = await axios({ url, responseType: "stream" });
  const writer = fs.createWriteStream(filePath);
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports.config = {
  name: "imgbb",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Upload Image/GIF to imgbb.com",
  commandCategory: "Utilities",
  usages: "[reply image/GIF]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { type, messageReply, threadID, messageID } = event;

  if (type !== "message_reply" || !messageReply?.attachments || messageReply.attachments.length === 0)
    return api.sendMessage("⚠ Reply to an image or GIF!", threadID, messageID);

  const att = messageReply.attachments[0];

  if (att.type !== "photo" && att.type !== "animated_image")
    return api.sendMessage("❌ Imgbb only supports image or GIF!", threadID, messageID);

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const ext = att.type === "animated_image" ? "gif" : "jpg";
  const filePath = path.join(cacheDir, `imgbb_${Date.now()}.${ext}`);

  try {
    await downloadFile(att.url, filePath);

    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    api.sendMessage("⏳ Uploading to Imgbb…", threadID, messageID);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=ac2771c6abbfdfe4f78dc49cd717008c`,
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(filePath);

    const link = res.data.data.url;
    return api.sendMessage(`✅ Uploaded Successfully (Imgbb):\n${link}`, threadID, messageID);

  } catch (e) {
    console.log("❌ Error:", e.response?.data || e.message);
    return api.sendMessage("❌ Upload failed — check console for details.", threadID, messageID);
  }
};
