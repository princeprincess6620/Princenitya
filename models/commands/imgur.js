const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { downloadFile } = require("../../utils");

module.exports.config = {
    name: "imgur",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Upload Image/Video to Imgur (No external API)",
    commandCategory: "Utilities",
    usages: "[reply image/video]",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, type, messageReply } = event;

    if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage("⚠ Reply to an image/video!", threadID, messageID);
    }

    const ClientID = "YOUR_CLIENT_ID"; // ← yaha apna Client-ID daalo

    const tempDir = path.join(__dirname, "cache");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    let filePath;
    let ext = "jpg";

    const att = messageReply.attachments[0];

    if (att.type === "photo") ext = "jpg";
    else if (att.type === "video") ext = "mp4";
    else if (att.type === "animated_image") ext = "gif";

    filePath = path.join(tempDir, `imgur_${Date.now()}.${ext}`);
    await downloadFile(att.url, filePath);

    api.sendMessage("⏳ Uploading to Imgur…", threadID, messageID);

    try {
        const data = fs.readFileSync(filePath, { encoding: "base64" });

        const res = await axios.post(
            "https://api.imgur.com/3/upload",
            { image: data, type: "base64" },
            { headers: { Authorization: `Client-ID ${ClientID}` } }
        );

        const link = res.data.data.link;

        fs.unlinkSync(filePath);

        return api.sendMessage(`✅ Uploaded:\n${link}`, threadID, messageID);

    } catch (err) {
        console.log("❌ Error:", err.response?.data || err.message);
        return api.sendMessage("❌ Upload failed.", threadID, messageID);
    }
};
