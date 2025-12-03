const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "movevideo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Aryan",
    description: "Convert photo to talking/animated video",
    commandCategory: "media",
    usages: ".move video [text]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const text = args.join(" ") || "Hello, nice to meet you!";
        const attachments = event.messageReply?.attachments || event.attachments;

        if (!attachments || attachments.length === 0 || attachments[0].type !== "photo") {
            return api.sendMessage("📸 **Please reply to a photo and type**: .move video", event.threadID, event.messageID);
        }

        const imageUrl = attachments[0].url;

        api.sendMessage("⏳ Generating animated video... Please wait 5-10s...", event.threadID, event.messageID);

        const response = await axios.post("https://aryan-d-id-video-api.onrender.com/generate", {
            image_url: imageUrl,
            text: text
        });

        if (!response.data || !response.data.video_url) {
            return api.sendMessage("❌ Failed to generate video. Try again later.", event.threadID, event.messageID);
        }

        const videoPath = path.join(__dirname, `/cache/${Date.now()}.mp4`);
        const videoStream = await axios.get(response.data.video_url, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, Buffer.from(videoStream.data));

        return api.sendMessage(
            { body: "🎉 **Video Generated Successfully!**", attachment: fs.createReadStream(videoPath) },
            event.threadID,
            () => fs.unlinkSync(videoPath)
        );

    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Process failed. Error generating video.", event.threadID, event.messageID);
    }
};
