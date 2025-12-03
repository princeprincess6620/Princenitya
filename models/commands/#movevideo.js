const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "movevideo",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Aryan",
    description: "Convert photo to talking / animated video (Debug Version)",
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

        api.sendMessage("⏳ Generating animated video... Debug mode active! Check console for logs.", event.threadID, event.messageID);

        console.log("🔍 DEBUG: Sending Request to API...");
        console.log("🖼 IMAGE URL:", imageUrl);
        console.log("📝 TEXT:", text);

        const response = await axios.post("https://aryan-d-id-video-api.onrender.com/generate", {
            image_url: imageUrl,
            text: text
        });

        console.log("📥 API FULL RESPONSE:");
        console.log(response.data);

        if (!response.data || !response.data.video_url) {
            console.log("❌ ERROR: video_url missing in API response");
            return api.sendMessage("❌ API returned no video. Check console for more details.", event.threadID, event.messageID);
        }

        const videoPath = path.join(__dirname, `/cache/${Date.now()}.mp4`);
        console.log("⬇ Downloading video from:", response.data.video_url);

        const videoStream = await axios.get(response.data.video_url, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, Buffer.from(videoStream.data));

        console.log("🎉 VIDEO SAVED:", videoPath);

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
            `❌ Process failed.\nCheck console logs for more details.`,
            event.threadID,
            event.messageID
        );
    }
};
