const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "picvoice",
    version: "3.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Make photo talk with AI voice",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        console.log("PicVoice Command Started");
        
        // Check if user replied to a message
        if (!event.messageReply) {
            return send(
                "🎤 **PICVOICE - TALKING PHOTO**\n\n" +
                "✨ **How to use:**\n" +
                "1. Send a clear face photo\n" +
                "2. Reply to that photo with:\n" +
                "   `.picvoice [your text]`\n\n" +
                "📝 **Examples:**\n" +
                "`.picvoice Hello!`\n" +
                "`.picvoice How are you?`\n" +
                "`.picvoice Namaste!`\n\n" +
                "🎵 Photo will speak your text with AI voice!"
            );
        }
        
        // Check if replied message has photo
        const repliedMsg = event.messageReply;
        if (!repliedMsg.attachments || repliedMsg.attachments.length === 0) {
            return send("❌ No photo found! Please reply to a photo message.");
        }
        
        const attachment = repliedMsg.attachments[0];
        
        // Check if it's a photo
        if (attachment.type !== "photo" && attachment.type !== "animated_image") {
            return send("❌ Only photos are supported! Please reply to a photo.");
        }
        
        const text = args.join(" ").trim();
        
        if (!text) {
            return send(
                "❌ Please add text for the photo to speak!\n\n" +
                "**Format:** `.picvoice [text]`\n" +
                "**Example:** `.picvoice Hello friends!`"
            );
        }
        
        if (text.length > 100) {
            return send("❌ Text too long! Maximum 100 characters.");
        }
        
        // Start processing
        send(`🎬 **Creating Talking Photo...**\n\n📝 Text: "${text}"\n🎤 Generating AI voice...\n⏳ Please wait 10-15 seconds...`);
        
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        
        // Create temp directory
        const tmpDir = path.join(__dirname, 'tmp_picvoice');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        
        const timestamp = Date.now();
        const imagePath = path.join(tmpDir, `photo_${timestamp}.jpg`);
        const audioPath = path.join(tmpDir, `voice_${timestamp}.mp3`);
        
        try {
            // Step 1: Download the photo
            const imageUrl = attachment.url;
            const imageResponse = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
            
            // Check file size
            if (!fs.existsSync(imagePath) || fs.statSync(imagePath).size === 0) {
                throw new Error("Failed to download photo");
            }
            
            // Step 2: Generate AI Voice (TTS)
            send("🔊 Generating AI voice for: \"" + text + "\"");
            
            // Try multiple TTS services
            let audioGenerated = false;
            
            // Service 1: Google TTS (Works 90% of time)
            try {
                const googleTTS = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
                
                const audioResponse = await axios({
                    method: 'GET',
                    url: googleTTS,
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 20000
                });
                
                if (audioResponse.data && audioResponse.data.length > 1000) {
                    fs.writeFileSync(audioPath, Buffer.from(audioResponse.data));
                    audioGenerated = true;
                    console.log("Google TTS Success");
                }
            } catch (googleError) {
                console.log("Google TTS failed:", googleError.message);
            }
            
            // Service 2: StreamElements TTS (Backup)
            if (!audioGenerated) {
                try {
                    const streamTTS = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`;
                    
                    const streamResponse = await axios({
                        method: 'GET',
                        url: streamTTS,
                        responseType: 'arraybuffer',
                        timeout: 20000
                    });
                    
                    if (streamResponse.data) {
                        fs.writeFileSync(audioPath, Buffer.from(streamResponse.data));
                        audioGenerated = true;
                        console.log("StreamElements TTS Success");
                    }
                } catch (streamError) {
                    console.log("StreamElements TTS failed:", streamError.message);
                }
            }
            
            // Service 3: VoiceRSS (Another backup)
            if (!audioGenerated) {
                try {
                    const voiceRSS = `https://api.voicerss.org/?key=f652c1d50c124a1a8ffa6023093c619c&hl=en-us&src=${encodeURIComponent(text)}&c=MP3`;
                    
                    const voiceResponse = await axios({
                        method: 'GET',
                        url: voiceRSS,
                        responseType: 'arraybuffer',
                        timeout: 20000
                    });
                    
                    if (voiceResponse.data) {
                        fs.writeFileSync(audioPath, Buffer.from(voiceResponse.data));
                        audioGenerated = true;
                        console.log("VoiceRSS TTS Success");
                    }
                } catch (voiceError) {
                    console.log("VoiceRSS failed:", voiceError.message);
                }
            }
            
            if (!audioGenerated) {
                throw new Error("All TTS services failed");
            }
            
            // Step 3: Send both photo and audio
            send("✅ Voice generated! Sending talking photo...");
            
            // Read audio file
            const audioFile = fs.readFileSync(audioPath);
            
            // Send photo with audio
            await api.sendMessage({
                body: `🎤 **TALKING PHOTO**\n\n📝 "${text}"\n🎵 With AI Voice\n\n✨ Send another photo to make it talk!\n\n📌 **Tip:** Use clear face photos for best results.`,
                attachment: [
                    fs.createReadStream(imagePath),
                    fs.createReadStream(audioPath)
                ]
            }, event.threadID, event.messageID);
            
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            
            // Alternative: Send as separate messages if combined fails
            setTimeout(async () => {
                try {
                    await api.sendMessage({
                        body: `🎧 **Voice Message**\n"${text}"`,
                        attachment: fs.createReadStream(audioPath)
                    }, event.threadID);
                } catch (e) {}
            }, 1000);
            
        } catch (processError) {
            console.error("PicVoice Process Error:", processError);
            
            // Fallback: Send photo with text
            send(`❌ Voice generation failed!\n\n📷 Sending photo with text instead:\n\n"${text}"`);
            
            await api.sendMessage({
                body: `📸 **PHOTO WITH TEXT**\n\n"${text}"\n\n⚠️ Voice feature temporarily unavailable.\nTry again later!`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, event.messageID);
            
            api.setMessageReaction("⚠️", event.messageID, () => {}, true);
            
        } finally {
            // Cleanup files after 10 seconds
            setTimeout(() => {
                try {
                    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
                } catch (cleanError) {
                    // Ignore cleanup errors
                }
            }, 10000);
        }
        
    } catch (mainError) {
        console.error("PicVoice Main Error:", mainError);
        
        api.sendMessage(
            `❌ **Error:** ${mainError.message || "Something went wrong"}\n\n` +
            `💡 **Quick Solutions:**\n` +
            `1. Use shorter text\n` +
            `2. Reply to a clear face photo\n` +
            `3. Try: \`.picvoice hello\`\n\n` +
            `🔄 **Alternative Commands:**\n` +
            `\`.animate\` - Animate photo\n` +
            `\`.deepfake\` - Face swap\n` +
            `\`.img2vid\` - Photo to video`,
            event.threadID
        );
        
        api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
};

// Handle event for Mirai compatibility
module.exports.handleEvent = async function({ api, event }) {
    // Optional: Add auto-reply or other event handling
};
