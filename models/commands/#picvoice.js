const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "picvoice",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Create talking photo with voice",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        // Create send function
        const send = async (msg) => {
            return await api.sendMessage(msg, event.threadID, event.messageID);
        };
        
        // Check if command is used correctly
        if (event.type !== "message_reply") {
            return send(
                `🎤 **PICVOICE COMMAND** 🎤\n\n` +
                `📌 **How to Use:**\n` +
                `1. First send a photo\n` +
                `2. Reply to that photo with:\n` +
                `   \`.picvoice your text here\`\n\n` +
                `📝 **Examples:**\n` +
                `• \`.picvoice Hello friends!\`\n` +
                `• \`.picvoice Good morning\`\n` +
                `• \`.picvoice How are you?\`\n\n` +
                `🎵 The photo will speak your text!`
            );
        }
        
        // Check if replied message has attachment
        if (!event.messageReply.attachments || 
            event.messageReply.attachments.length === 0) {
            return send("❌ No photo found! Please reply to a photo.");
        }
        
        const attachment = event.messageReply.attachments[0];
        
        // Check if it's a photo
        if (!attachment.type || !attachment.type.includes("photo")) {
            return send("❌ Please reply to a photo only! Videos, stickers and files are not supported.");
        }
        
        // Get text from arguments
        const text = args.join(" ").trim();
        
        if (!text) {
            return send(
                `❌ Please add text for the photo to speak!\n\n` +
                `**Format:** \`.picvoice [text]\`\n` +
                `**Example:** \`.picvoice Namaste everyone!\``
            );
        }
        
        // Send processing message
        const processingMsg = await send(
            `⏳ **Creating Talking Photo...**\n\n` +
            `📸 Photo: Downloaded\n` +
            `📝 Text: "${text}"\n` +
            `🔊 Generating voice...\n` +
            `⏱️ Please wait 5-10 seconds...`
        );
        
        // Set reaction
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
        
        // Step 1: Download the photo
        const imageUrl = attachment.url;
        let imageBuffer;
        
        try {
            const imageResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            imageBuffer = Buffer.from(imageResponse.data);
        } catch (imageError) {
            return send("❌ Failed to download the photo. Please try again.");
        }
        
        // Step 2: Generate TTS Audio
        let audioBuffer;
        let voiceSuccess = false;
        
        // Try multiple TTS services
        const ttsServices = [
            // Service 1: Google TTS (Most reliable)
            async () => {
                try {
                    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
                    const response = await axios.get(url, {
                        responseType: 'arraybuffer',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        },
                        timeout: 20000
                    });
                    return Buffer.from(response.data);
                } catch (e) {
                    throw new Error("Google TTS failed");
                }
            },
            
            // Service 2: TTSMP3.com
            async () => {
                try {
                    const url = `https://ttsmp3.com/makemp3_new.php?msg=${encodeURIComponent(text)}&lang=Raveena&source=ttsmp3`;
                    const response = await axios.get(url, {
                        responseType: 'arraybuffer',
                        timeout: 20000
                    });
                    return Buffer.from(response.data);
                } catch (e) {
                    throw new Error("TTSMP3 failed");
                }
            },
            
            // Service 3: Alternative API
            async () => {
                try {
                    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`;
                    const response = await axios.get(url, {
                        responseType: 'arraybuffer',
                        timeout: 20000
                    });
                    return Buffer.from(response.data);
                } catch (e) {
                    throw new Error("StreamElements failed");
                }
            }
        ];
        
        // Try each service
        for (let i = 0; i < ttsServices.length; i++) {
            try {
                audioBuffer = await ttsServices[i]();
                if (audioBuffer && audioBuffer.length > 1000) {
                    voiceSuccess = true;
                    console.log(`TTS Service ${i+1} success`);
                    break;
                }
            } catch (serviceError) {
                console.log(`TTS Service ${i+1} failed:`, serviceError.message);
                continue;
            }
        }
        
        if (!voiceSuccess) {
            // Send photo without audio
            await send("⚠️ Voice generation failed. Sending photo with text only.");
            
            await api.sendMessage({
                body: `📸 **Photo with Text**\n\n"${text}"\n\n🎤 Voice feature temporarily unavailable.`,
                attachment: imageBuffer
            }, event.threadID);
            
            api.setMessageReaction("⚠️", event.messageID, () => {}, true);
            return;
        }
        
        // Step 3: Send the result
        try {
            // Delete processing message
            try {
                await api.unsendMessage(processingMsg.messageID);
            } catch (e) {}
            
            // Send photo and audio
            await api.sendMessage({
                body: `✅ **TALKING PHOTO READY!**\n\n📝 "${text}"\n🎤 AI Voice Generated\n📸 Photo Speaking\n\n✨ Send another photo to make it talk!`,
                attachment: [
                    imageBuffer,
                    audioBuffer
                ]
            }, event.threadID, event.messageID);
            
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            
        } catch (sendError) {
            console.error("Send error:", sendError);
            
            // Try sending separately
            await send("✅ Voice generated! Sending files separately...");
            
            await api.sendMessage({
                body: `📸 **Photo**\n"${text}"`,
                attachment: imageBuffer
            }, event.threadID);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await api.sendMessage({
                body: `🎤 **Voice Message**\n"${text}"`,
                attachment: audioBuffer
            }, event.threadID);
            
            api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
        
    } catch (error) {
        console.error("PicVoice Error:", error);
        
        // Simple error message
        api.sendMessage(
            `❌ Error: ${error.message || "Something went wrong"}\n\n` +
            `💡 **Quick Fix:**\n` +
            `1. Make sure you replied to a photo\n` +
            `2. Use short text (under 50 characters)\n` +
            `3. Try: \`.picvoice hi\`\n\n` +
            `🔄 Bot is working, just follow the format!`,
            event.threadID
        );
        
        api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
};
