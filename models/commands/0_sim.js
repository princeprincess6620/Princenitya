module.exports.config = {
    name: "sim",
    version: "4.3.7",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Chat with AI chatbot. Fixed by Priyansh Rajput",
    commandCategory: "Chat with AI",
    usages: "[args]",
    cooldowns: 5,
    dependencies: {
        axios: ""
    }
};

async function simsimi(a, b, c) {
    const axios = require("axios");
    try {
        var { data: j } = await axios({ 
            url: `https://aryan-nitya-ai-api-chat-bot.onrender.com/aryan?query=${encodeURIComponent(a)}`, 
            method: "GET" 
        });
        return { error: !1, data: j };
    } catch (p) {
        console.error("API Error:", p);
        return { error: !0, data: {} };
    }
}

module.exports.onLoad = async function() {
    if (typeof global.manhG === "undefined") {
        global.manhG = {};
    }
    if (typeof global.manhG.simsimi === "undefined") {
        global.manhG.simsimi = new Map();
    }
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (global.manhG.simsimi.has(threadID)) {
        if (senderID === api.getCurrentUserID() || !body || messageID === global.manhG.simsimi.get(threadID)) {
            return;
        }
        
        var { data, error } = await simsimi(body, api, event);
        
        if (error) {
            return api.sendMessage("[ 𝐀𝐈 ] - Sorry, I'm having trouble responding right now.", threadID, messageID);
        }
        
        if (data && data.response) {
            api.sendMessage(data.response, threadID, messageID);
        } else {
            api.sendMessage("[ 𝐀𝐈 ] - I didn't understand that. Can you try again?", threadID, messageID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length === 0) {
        return api.sendMessage("[ 𝐀𝐈 ] - You haven't entered a message yet.", threadID, messageID);
    }
    
    switch (args[0]) {
        case "on":
            if (global.manhG.simsimi.has(threadID)) {
                return api.sendMessage("[ 𝐀𝐈 ] - AI is already enabled in this thread.", threadID, messageID);
            } else {
                global.manhG.simsimi.set(threadID, messageID);
                return api.sendMessage("[ 𝐀𝐈 ] - AI has been enabled successfully. I'll now respond to messages in this thread.", threadID, messageID);
            }
            
        case "off":
            if (global.manhG.simsimi.has(threadID)) {
                global.manhG.simsimi.delete(threadID);
                return api.sendMessage("[ 𝐀𝐈 ] - AI has been disabled successfully.", threadID, messageID);
            } else {
                return api.sendMessage("[ 𝐀𝐈 ] - AI is not enabled in this thread.", threadID, messageID);
            }
            
        default:
            var { data, error } = await simsimi(args.join(" "), api, event);
            
            if (error) {
                return api.sendMessage("[ 𝐀𝐈 ] - Error connecting to the AI service. Please try again later.", threadID, messageID);
            }
            
            if (data && data.response) {
                return api.sendMessage(data.response, threadID, messageID);
            } else {
                return api.sendMessage("[ 𝐀𝐈 ] - Sorry, I couldn't process your request. Please try again.", threadID, messageID);
            }
    }
};
