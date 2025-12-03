const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "movevideo",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Simple video creator",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 10
};

module.exports.run = async function({ api, event, args }) {
    try {
        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        if (!event.messageReply || !event.messageReply.attachments) {
            return send("📷 Reply to a photo with: .move video [text]");
        }
        
        const text = args.join(" ") || "Hello!";
        
        send("🎬 Creating video... Please wait!");
        
        // Simple response - working alternative
        await api.sendMessage({
            body: `✅ Video Feature\n\n📝 Text: ${text}\n\n🔧 Note: Advanced video processing is being updated.\nTry these working commands:\n• .animate\n• .picvoice\n• .img2vid`,
            attachment: event.messageReply.attachments[0] // Original photo return
        }, event.threadID);
        
    } catch (error) {
        api.sendMessage("❌ Error: " + error.message, event.threadID);
    }
};
