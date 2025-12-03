const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
    name: "movevideo",
    version: "2.0.0",
    hasPermission: 0,  // Fixed spelling: hasPermssion → hasPermission
    credits: "Aryan",
    description: "Reply a photo with .move video <text> to generate AI video",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 8,
    dependencies: {
        "axios": "",
        "form-data": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        const RENDER_API = "https://aryan-d-id-video-api.onrender.com";
        const tmpDir = path.join(__dirname, "tmp_movevideo");

        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        // Check if command is used correctly
        if (event.type !== "message_reply") {
            return send("❌ Please reply to an image with the command: .move video [text]");
        }

        if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return send("❌ No attachment found in the replied message.");
        }

        const attachment = event.messageReply.attachments[0];
        
        if (attachment.type !== "photo") {
            return send("❌ Please reply to a photo only.");
        }

        const imageUrl = attachment.url;
        const text = args.join(" ").trim();

        if (!text) {
            return send("❌ Please provide text. Example: .move video Hello World!");
        }

        send("⏳ Processing your AI video... Please wait.");
        
        // React to show processing
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        // Download image
        const imgFile = path.join(tmpDir, `img_${Date.now()}.jpg`);
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(imgFile);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Upload to API
        const form = new FormData();
        form.append('file', fs.createReadStream(imgFile));

        const upload = await axios.post(`${RENDER_API}/upload`, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });

        const imageId = upload.data.id;

        if (!imageId) {
            throw new Error("Failed to upload image to API");
        }

        // Process video
        const create = await axios.post(`${RENDER_API}/process`, {
            image_id: imageId,
            text: text,
            voice: "hi-IN-MadhurNeural"
        });

        const videoId = create.data.id;
        
        if (!videoId) {
            throw new Error("Failed to start video generation");
        }

        send("🔄 Video is being generated... This may take 15-30 seconds.");

        // Check status with timeout
        let videoUrl = null;
        let attempts = 0;
        const maxAttempts = 20; // 20 * 5 = 100 seconds max

        while (attempts < maxAttempts && !videoUrl) {
            try {
                const check = await axios.get(`${RENDER_API}/result/${videoId}`);
                
                if (check.data && check.data.url) {
                    videoUrl = check.data.url;
                    break;
                }
                
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (e) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (!videoUrl) {
            throw new Error("Video generation timeout. Please try again.");
        }

        // Download video
        const videoPath = path.join(tmpDir, `video_${Date.now()}.mp4`);
        const videoResponse = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream'
        });

        const videoWriter = fs.createWriteStream(videoPath);
        videoResponse.data.pipe(videoWriter);

        await new Promise((resolve, reject) => {
            videoWriter.on('finish', resolve);
            videoWriter.on('error', reject);
        });

        // Send video
        await api.sendMessage({
            body: `✅ Your AI video is ready!\n📝 Text: ${text}`,
            attachment: fs.createReadStream(videoPath)
        }, event.threadID, event.messageID);

        // Cleanup
        try {
            fs.unlinkSync(imgFile);
            fs.unlinkSync(videoPath);
        } catch (cleanupErr) {
            console.log("Cleanup error:", cleanupErr);
        }

        // Success reaction
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    } catch (error) {
        console.error("MoveVideo Error:", error);
        api.sendMessage(`❌ Error: ${error.message || "Unknown error occurred"}`, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }
};

module.exports.handleEvent = async function({ api, event }) {
    // This function can be used for command detection if needed
    // Not required for basic functionality
};
