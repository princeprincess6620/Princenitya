const axios = require('axios');

module.exports.config = {
    name: "movevideo",
    version: "2.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Video creator using online API",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 15
};

module.exports.run = async function({ api, event, args }) {
    try {
        if (!event.messageReply || !event.messageReply.attachments) {
            return api.sendMessage(
                "📸 **VIDEO MAKER**\n\n1. Send a photo\n2. Reply with:\n`.move video [text]`\n\nExample:\n`.move video Hello!`",
                event.threadID,
                event.messageID
            );
        }
        
        const photo = event.messageReply.attachments[0];
        const text = args.join(" ") || "Hello from Mirai Bot";
        
        api.sendMessage(`🎬 Creating video: "${text}"\n⏳ Please wait...`, event.threadID, event.messageID);
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        
        // Use online video generation API
        const response = await axios.post('https://video-maker-api.herokuapp.com/generate', {
            image_url: photo.url,
            text: text,
            duration: 5
        });
        
        if (response.data && response.data.video_url) {
            const videoResponse = await axios.get(response.data.video_url, { responseType: 'stream' });
            
            await api.sendMessage({
                body: `✅ **VIDEO READY**\n\n📝 "${text}"\n⏱️ 5 seconds\n\nMade with ❤️ by Mirai Bot`,
                attachment: videoResponse.data
            }, event.threadID);
            
            api.setMessageReaction("✅", event.messageID, () => {}, true);
        } else {
            throw new Error("No video URL received");
        }
        
    } catch (error) {
        console.error(error);
        
        // Fallback to picvoice suggestion
        api.sendMessage({
            body: `❌ Video service unavailable.\n\n✨ **TRY THIS INSTEAD:**\n\`.picvoice [text]\`\n\nThis will create a talking photo with voice!\n\nExample:\n\`.picvoice ${args.join(" ") || "Hello"}\``
        }, event.threadID);
        
        api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
};
