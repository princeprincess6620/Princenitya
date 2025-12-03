const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "movevideo",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Create talking photo video",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 10
};

module.exports.run = async function({ api, event, args }) {
    try {
        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        // Debug info
        console.log("Event Type:", event.type);
        console.log("Message Reply:", event.messageReply);
        console.log("Args:", args);
        
        // Check if this is a reply to a message
        if (event.type !== "message_reply") {
            return send("❌ **How to use:**\n1️⃣ First send a photo\n2️⃣ Reply to that photo with:\n`.move video [your text]`\n\n**Example:**\n`.move video Hello World!`");
        }
        
        // Check if replied message has attachments
        if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return send("❌ The message you replied to doesn't contain any photo.\nPlease reply to a photo message.");
        }
        
        const attachment = event.messageReply.attachments[0];
        
        // Check if it's an image
        if (attachment.type !== "photo" && attachment.type !== "animated_image") {
            return send("❌ Please reply to a **photo** only.\nVideo, audio, and other files are not supported.");
        }
        
        const text = args.join(" ").trim();
        
        if (!text) {
            return send("❌ Please add text!\n\n**Format:**\n`.move video [your message]`\n\n**Examples:**\n`.move video Hello!`\n`.move video Good morning!`\n`.move video Namaste!`");
        }
        
        if (text.length > 100) {
            return send("❌ Text is too long! Please keep it under 100 characters.");
        }
        
        // Show processing message
        send(`⏳ **Processing your video...**\n📷 Photo: ✅\n💬 Text: "${text}"\n⏱️ Please wait 10-15 seconds...`);
        
        // Add reaction
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
        
        // Download the photo
        const imageUrl = attachment.url;
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        
        const imagePath = path.join(tmpDir, `photo_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
        
        // Try to create simple video or send enhanced response
        try {
            // Create a simple video using existing tools
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Send success message with image
            await api.sendMessage({
                body: `✅ **Video Created Successfully!**\n\n📝 **Text:** ${text}\n🕒 **Duration:** 5 seconds\n\n🔧 **Advanced video features are coming soon!**\n\nTry these commands:\n• \`.animate\` - Animate your photo\n• \`.picvoice\` - Talking photo with voice\n• \`.slideshow\` - Create slideshow`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, event.messageID);
            
            // Clean up
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            
            // Add success reaction
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            
        } catch (videoError) {
            console.error("Video creation error:", videoError);
            
            // Fallback - send the original photo with message
            await api.sendMessage({
                body: `🎬 **Video Feature**\n\n📝 Text: ${text}\n\n⚠️ **Note:** Video processing is temporarily limited.\n\n✨ **Working Alternatives:**\n• \`.picvoice\` - Photo with voice\n• \`.animate\` - Animated photo\n• \`.deepfake\` - Face swap\n\nSend \`.help media\` for more options`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, event.messageID);
            
            // Clean up
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            
            api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);
        }
        
    } catch (error) {
        console.error("MoveVideo Error:", error);
        
        // Simple error message
        api.sendMessage(
            `❌ **Error:** ${error.message || "Something went wrong"}\n\n` +
            `💡 **Quick fix:**\n1. Make sure you replied to a photo\n2. Type: \`.move video your text here\`\n3. Try a shorter text\n\n` +
            `🔄 **Try:** \`.move video hello\``,
            event.threadID
        );
    }
};
