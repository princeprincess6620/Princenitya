const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

module.exports.config = {
    name: "movevideo",
    version: "3.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Create real talking photo video",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 20,
    dependencies: {
        "axios": "",
        "fluent-ffmpeg": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        // Debug log
        console.log("MoveVideo Command Started");
        
        // Check reply
        if (!event.messageReply) {
            return send("📸 **HOW TO USE:**\n\n1. Send or forward a photo\n2. Reply to that photo with:\n`.move video [your text]`\n\n**Example:**\n`.move video Hello World`\n`.move video Good morning`");
        }
        
        // Check attachment
        const repliedMsg = event.messageReply;
        if (!repliedMsg.attachments || repliedMsg.attachments.length === 0) {
            return send("❌ No photo found in the replied message.\nPlease reply to a photo message.");
        }
        
        const attachment = repliedMsg.attachments[0];
        
        // Validate image
        if (attachment.type !== "photo" && attachment.type !== "animated_image") {
            return send("❌ Only photos are supported!\nPlease reply to a photo, not video/sticker/document.");
        }
        
        const text = args.join(" ").trim();
        
        if (!text) {
            return send("❌ Please add text!\n\n**Format:** `.move video [text]`\n**Example:** `.move video Namaste!`");
        }
        
        if (text.length > 60) {
            return send("❌ Text too long! Max 60 characters.\nExample: `.move video Hello friends`");
        }
        
        send(`🎬 **Creating Video...**\n📝 Text: "${text}"\n⏳ Please wait 15-20 seconds...`);
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        
        // Create temp directory
        const tmpDir = path.join(__dirname, 'tmp_movevideo');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        
        const timestamp = Date.now();
        const files = {
            image: path.join(tmpDir, `img_${timestamp}.jpg`),
            audio: path.join(tmpDir, `audio_${timestamp}.mp3`),
            video: path.join(tmpDir, `video_${timestamp}.mp4`),
            final: path.join(tmpDir, `final_${timestamp}.mp4`)
        };
        
        try {
            // Step 1: Download image
            send("⬇️ Downloading photo...");
            const imageUrl = attachment.url;
            const imageResponse = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            fs.writeFileSync(files.image, Buffer.from(imageResponse.data));
            
            // Check if image downloaded
            if (!fs.existsSync(files.image) || fs.statSync(files.image).size === 0) {
                throw new Error("Failed to download image");
            }
            
            // Step 2: Generate audio (TTS)
            send("🔊 Generating voice...");
            try {
                // Method 1: Google TTS
                const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
                const audioResponse = await axios({
                    method: 'GET',
                    url: ttsUrl,
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    },
                    timeout: 30000
                });
                fs.writeFileSync(files.audio, Buffer.from(audioResponse.data));
            } catch (ttsError) {
                // Method 2: Alternative TTS
                const altTtsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`;
                const altAudio = await axios.get(altTtsUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(files.audio, Buffer.from(altAudio.data));
            }
            
            // Step 3: Get audio duration
            let audioDuration = 5.0;
            try {
                const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${files.audio}"`);
                audioDuration = parseFloat(stdout) || 5.0;
            } catch (e) {
                audioDuration = 5.0;
            }
            
            // Step 4: Create video with zoom effect
            send("🎥 Creating video with zoom effect...");
            
            // Simple video creation command
            const ffmpegCmd = `ffmpeg -loop 1 -i "${files.image}" -i "${files.audio}" -vf "scale=720:720:force_original_aspect_ratio=decrease,pad=720:720:(ow-iw)/2:(oh-ih)/2,setsar=1,zoompan=z='min(zoom+0.001,1.5)':d=${Math.ceil(audioDuration)}*30" -c:v libx264 -t ${audioDuration} -pix_fmt yuv420p -c:a aac -shortest -y "${files.video}"`;
            
            console.log("FFMPEG Command:", ffmpegCmd);
            
            await execAsync(ffmpegCmd, { timeout: 60000 });
            
            // Check if video created
            if (!fs.existsSync(files.video) || fs.statSync(files.video).size < 1024) {
                // Try alternative simple command
                const simpleCmd = `ffmpeg -loop 1 -i "${files.image}" -i "${files.audio}" -c:v libx264 -t ${audioDuration} -pix_fmt yuv420p -c:a aac -shortest -y "${files.video}"`;
                await execAsync(simpleCmd, { timeout: 60000 });
            }
            
            // Step 5: Send video
            send("📤 Sending video...");
            
            // Check final video file
            if (fs.existsSync(files.video) && fs.statSync(files.video).size > 1024) {
                await api.sendMessage({
                    body: `✅ **TALKING PHOTO VIDEO**\n\n📝 Text: "${text}"\n🎵 With Voice\n⏱️ Duration: ${audioDuration.toFixed(1)}s\n\n👍 React if you like it!`,
                    attachment: fs.createReadStream(files.video)
                }, event.threadID, event.messageID);
                
                api.setMessageReaction("✅", event.messageID, () => {}, true);
            } else {
                // Fallback: Send original image with audio
                await api.sendMessage({
                    body: `🎬 **Talking Photo**\n\n📝 Text: "${text}"\n🎵 Voice generated\n\n⚠️ Video processing failed, sending photo instead.\nTry: \`.picvoice [text]\` for better results.`,
                    attachment: fs.createReadStream(files.image)
                }, event.threadID, event.messageID);
                
                api.setMessageReaction("⚠️", event.messageID, () => {}, true);
            }
            
        } catch (processError) {
            console.error("Process Error:", processError);
            
            // Send error with helpful message
            send(`❌ Video creation failed!\n\n💡 **Try these instead:**\n• \`.picvoice [text]\` - Talking photo\n• \`.animate\` - Animate photo\n• \`.img2vid\` - Convert image to video\n\n🔧 **Error:** ${processError.message}`);
            
            api.setMessageReaction("❌", event.messageID, () => {}, true);
        } finally {
            // Cleanup files after 10 seconds
            setTimeout(() => {
                Object.values(files).forEach(file => {
                    if (fs.existsSync(file)) {
                        try {
                            fs.unlinkSync(file);
                        } catch (e) {}
                    }
                });
            }, 10000);
        }
        
    } catch (error) {
        console.error("MoveVideo Main Error:", error);
        api.sendMessage(
            `❌ **Error:** ${error.message || "Unknown error"}\n\n` +
            `📌 **Quick Fix:**\n1. Reply to a clear photo\n2. Use short text\n3. Try: \`.move video hi\`\n\n` +
            `🔄 **Working Commands:**\n\`.picvoice\` \`.animate\` \`.deepfake\``,
            event.threadID
        );
    }
};
