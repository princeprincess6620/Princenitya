const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Download helper function
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
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Upload Image/GIF to imgbb.com",
  commandCategory: "Utilities",
  usages: "[reply image/GIF]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { type, messageReply, threadID, messageID } = event;

  // Check reply and attachments
  if (type !== "message_reply" || !messageReply?.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("⚠ Reply to an image or GIF!", threadID, messageID);
  }

  const att = messageReply.attachments[0];

  // Allow only photo or animated_image
  if (att.type !== "photo" && att.type !== "animated_image") {
    return api.sendMessage("❌ Imgbb only supports image or GIF!", threadID, messageID);
  }

  // Ensure cache folder exists
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // File path
  const ext = att.type === "animated_image" ? "gif" : "jpg";
  const filePath = path.join(cacheDir, `imgbb_${Date.now()}.${ext}`);

  try {
    // Download the file
    await downloadFile(att.url, filePath);

    // Convert to base64
    const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });

    api.sendMessage("⏳ Uploading to Imgbb…", threadID, messageID);

    // Imgbb API request
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=ac2771c6abbfdfe4f78dc49cd717008c`,
      { image: imageBase64 }
    );

    // Delete local file
    fs.unlinkSync(filePath);

    // Send success message
    const link = res.data.data.url;
    return api.sendMessage(`✅ Uploaded Successfully (Imgbb):\n${link}`, threadID, messageID);

  } catch (e) {
    console.log("❌ Error:", e.response?.data || e.message);
    return api.sendMessage("❌ Upload failed — check console for details.", threadID, messageID);
  }
};
