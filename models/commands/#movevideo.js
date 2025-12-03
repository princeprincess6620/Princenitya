const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "movevideo",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "Aryan",
    description: "Convert photo to animated talking video",
    commandCategory: "media",
    usages: ".move video [text]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const text = args.join(" ") || "Hello, nice to meet you!";
        const attachments = event.messageReply?.attachments || event.attachments;

        if (!attachments || attachments.length === 0 || attachments[0].type !== "photo") {
            return api.sendMessage("📸 Please reply to a photo and type .move video", event.threadID, event.messageID);
        }

        const imageUrl = attachments[0].url;

        api.sendMessage("⏳ Generating video... Please wait\n(Debug Mode Enabled)", event.threadID, event.messageID);

        console.log("=========================================");
        console.log("🔍 DEBUG: Sending Request to API...");
        console.log("🖼 IMAGE URL:", imageUrl);
        console.log("📝 TEXT:", text);
        console.log("=========================================");

        // NEW FIXED ENDPOINT HERE ⬇
        const response = await axios.post("https://aryan-d-id-video-api.onrender.com/create-video", {
            image_url: imageUrl,
            text: text
        });

        console.log("📥 API RESPONSE DATA:");
        console.log(response.data);

        if (!response.data || !response.data.video_url) {
            console.log("❌ ERROR: video_url missing in response");
            return api.sendMessage("❌ API returned no video URL. Check console.", event.threadID, event.messageID);
        }

        const videoPath = path.join(__dirname, `/cache/${Date.now()}.mp4`);

        console.log("⬇ Downloading video from URL:", response.data.video_url);

        const videoStream = await axios.get(response.data.video_url, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, Buffer.from(videoStream.data));

        console.log("🎉 Video saved at:", videoPath);

        return api.sendMessage(
            { body: "🎉 Video Generated Successfully!", attachment: fs.createReadStream(videoPath) },
            event.threadID,
            () => fs.unlinkSync(videoPath)
        );

    } catch (err) {
        console.log("❌ ERROR OCCURRED:");
        console.log("Status Code:", err.response?.status);
        console.log("Error Data:", err.response?.data);
        console.log("Details:", err.message);

        return api.sendMessage(
            `❌ Process failed.\nCheck console for more details.`,
            event.threadID,
            event.messageID
        );
    }
};
