const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
    name: "movevideo",
    version: "2.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Reply a photo with .move video <text> to generate AI video",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
        "axios": "",
        "form-data": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        const tmpDir = path.join(__dirname, "tmp_movevideo");
        
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        // Check if user replied to a message
        if (!event.messageReply) {
            return send("❌ Please reply to an image with the command:\n.move video [your text here]\n\nExample: .move video Hello, how are you?");
        }

        // Check if replied message has attachments
        if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return send("❌ The replied message doesn't contain any image. Please reply to an image.");
        }

        const attachment = event.messageReply.attachments[0];
        
        // Check if it's an image
        if (!attachment.type || !attachment.type.includes("photo")) {
            return send("❌ Please reply to a photo only. Other file types are not supported.");
        }

        const imageUrl = attachment.url;
        const text = args.join(" ").trim();

        if (!text) {
            return send("❌ Please provide text for the video.\n\nExample:\n.move video Hello World!\n.move video Good morning!");
        }

        // Validate text length
        if (text.length > 100) {
            return send("❌ Text is too long! Please keep it under 100 characters.");
        }

        send("⏳ Downloading image and processing your AI video... Please wait patiently.");
        
        // React to show processing
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        // Step 1: Download the image
        const imgFile = path.join(tmpDir, `img_${Date.now()}.jpg`);
        
        try {
            const imageResponse = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'stream',
                timeout: 30000
            });

            const writer = fs.createWriteStream(imgFile);
            imageResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Check if file was downloaded successfully
            if (!fs.existsSync(imgFile) || fs.statSync(imgFile).size === 0) {
                throw new Error("Failed to download image");
            }

        } catch (downloadError) {
            return send("❌ Failed to download the image. Please try again with a different image.");
        }

        send("🔄 Image downloaded successfully! Now generating AI video...");

        // Step 2: Try multiple API endpoints (backup options)
        const API_ENDPOINTS = [
            "https://aryan-d-id-video-api.onrender.com",
            "https://d-id-video-api.vercel.app"
        ];

        let videoGenerated = false;
        let videoPath = null;
        
        for (const API_BASE of API_ENDPOINTS) {
            try {
                send(`🔄 Trying API: ${API_BASE.split('//')[1]?.split('.')[0]}...`);
                
                // First check if API is alive
                try {
                    await axios.get(`${API_BASE}/health`, { timeout: 5000 });
                } catch (healthError) {
                    continue; // Try next API
                }

                // Step 3: Upload image
                const form = new FormData();
                form.append('image', fs.createReadStream(imgFile), {
                    filename: 'image.jpg',
                    contentType: 'image/jpeg'
                });
                form.append('text', text);
                form.append('voice', 'hi-IN-MadhurNeural');

                const uploadResponse = await axios.post(`${API_BASE}/generate`, form, {
                    headers: {
                        ...form.getHeaders(),
                        'Accept': 'application/json'
                    },
                    timeout: 60000
                });

                if (!uploadResponse.data || !uploadResponse.data.videoUrl) {
                    continue; // Try next API
                }

                const videoUrl = uploadResponse.data.videoUrl;

                // Step 4: Download the generated video
                videoPath = path.join(tmpDir, `video_${Date.now()}.mp4`);
                
                const videoResponse = await axios({
                    method: 'GET',
                    url: videoUrl,
                    responseType: 'stream',
                    timeout: 60000
                });

                const videoWriter = fs.createWriteStream(videoPath);
                videoResponse.data.pipe(videoWriter);

                await new Promise((resolve, reject) => {
                    videoWriter.on('finish', resolve);
                    videoWriter.on('error', reject);
                });

                videoGenerated = true;
                break; // Success, exit loop

            } catch (apiError) {
                console.log(`API ${API_BASE} failed:`, apiError.message);
                continue; // Try next API
            }
        }

        if (!videoGenerated) {
            // Alternative: Use another service
            send("⚠️ Primary API failed. Trying alternative method...");
            
            // Alternative approach using different service
            try {
                const altResponse = await axios.post('https://video-ai-generator.herokuapp.com/create', {
                    image_url: imageUrl,
                    text: text,
                    duration: 5
                }, {
                    timeout: 90000
                });

                if (altResponse.data && altResponse.data.video_url) {
                    videoPath = path.join(tmpDir, `video_${Date.now()}.mp4`);
                    
                    const altVideo = await axios({
                        method: 'GET',
                        url: altResponse.data.video_url,
                        responseType: 'stream',
                        timeout: 60000
                    });

                    const altWriter = fs.createWriteStream(videoPath);
                    altVideo.data.pipe(altWriter);

                    await new Promise((resolve, reject) => {
                        altWriter.on('finish', resolve);
                        altWriter.on('error', reject);
                    });

                    videoGenerated = true;
                }
            } catch (altError) {
                console.log("Alternative method failed:", altError.message);
            }
        }

        if (!videoGenerated) {
            throw new Error("All video generation services are currently unavailable. Please try again later.");
        }

        // Step 5: Send the video
        send("✅ Video generated successfully! Sending now...");

        await api.sendMessage({
            body: `🎥 AI Video Generated Successfully!\n📝 Text: "${text}"\n\n👍 React with 👍 if you liked it!`,
            attachment: fs.createReadStream(videoPath)
        }, event.threadID, event.messageID);

        // Success reaction
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        // Step 6: Cleanup
        setTimeout(() => {
            try {
                if (fs.existsSync(imgFile)) fs.unlinkSync(imgFile);
                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            } catch (cleanupErr) {
                // Ignore cleanup errors
            }
        }, 5000);

    } catch (error) {
        console.error("MoveVideo Error:", error);
        
        let errorMessage = "❌ Error generating video: ";
        
        if (error.message.includes("timeout")) {
            errorMessage += "Request timeout. The server is taking too long to respond.";
        } else if (error.message.includes("500")) {
            errorMessage += "Server error. The video generation service is currently down.";
        } else if (error.message.includes("network")) {
            errorMessage += "Network error. Please check your internet connection.";
        } else {
            errorMessage += error.message || "Unknown error occurred";
        }
        
        errorMessage += "\n\n🔧 Troubleshooting:\n";
        errorMessage += "1. Try again after some time\n";
        errorMessage += "2. Use a different image\n";
        errorMessage += "3. Keep text short and simple\n";
        errorMessage += "4. Check if the bot has proper permissions";
        
        api.sendMessage(errorMessage, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }
};

// Handle event for Mirai compatibility
module.exports.handleEvent = async function({ api, event }) {
    // Not needed for this command, but kept for compatibility
};
