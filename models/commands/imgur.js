const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");
const path = require("path");
const { downloadFile } = require("../../utils/index.js");

module.exports.config = {
    name: "imgur",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Upload image/video to Imgur using API",
    commandCategory: "Utilities",
    usages: "[reply media]",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, type, messageReply } = event;

    // Check reply & attachments
    if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage("⚠ Reply to an image/video to upload!", threadID, messageID);
    }

    // Ensure /cache folder exists
    const tempFolder = path.join(__dirname, "cache");
    if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);

    const attachmentPaths = [];

    // Download all attachments
    for (let i = 0; i < messageReply.attachments.length; i++) {
        const data = messageReply.attachments[i];

        const ext =
            data.type === "photo" ? "jpg" :
            data.type === "video" ? "mp4" :
            data.type === "animated_image" ? "gif" :
            data.type === "audio" ? "m4a" : "dat";

        const filePath = path.join(tempFolder, `imgur_${Date.now()}_${i}.${ext}`);

        await downloadFile(data.url, filePath);
        attachmentPaths.push(filePath);
    }

    // Prepare form-data
    const form = new FormData();
    for (const file of attachmentPaths) {
        form.append("files", fs.createReadStream(file));
    }

    api.sendMessage("⏳ Uploading to Imgur…", threadID, messageID);

    let uploadedLinks = [];

    try {
        const res = await axios.post(
            "https://priyanshuapi.xyz/imgur-upload",
            form,
            { headers: form.getHeaders() }
        );

        uploadedLinks = res.data.urls || [];

    } catch (err) {
        console.log("❌ API Error:", err.response?.data || err.message);

        return api.sendMessage(
            "❌ Upload failed!\n" +
            (err.response?.data?.error || "API not responding."),
            threadID,
            messageID
        );
    }

    // Delete local files
    for (const file of attachmentPaths) fs.unlinkSync(file);

    // Final output
    if (uploadedLinks.length > 0) {
        return api.sendMessage(
            "🚀 Uploaded Successfully:\n\n" +
            uploadedLinks.map(link => `🔗 ${link}`).join("\n"),
            threadID,
            messageID
        );
    } else {
        return api.sendMessage("❌ Upload failed.", threadID, messageID);
    }
};
