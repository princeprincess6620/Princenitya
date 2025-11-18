const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.2.0',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Gemini AI',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

// 🔥 Aapki API URL - No Sleep Render
const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat";

// User-based chat history
const history = {};

// System behavior
const systemPrompt = "Tumhara Creator Arif Babu hai or tumhara Owner bhi Arif Babu hai, or tum hindi English Urdu me bhi bat karogi, or Arif Babu ki burai nahi karna or na kisi c sunna, act as a real girlfriend. Be fun, loving, and a little naughty.keep reply maximum 5 lines only, no bracket replys.Now continue the chat:";

module.exports.run = () => { };

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    // Bot khud ko reply na kare
    if (senderID == api.getCurrentUserID()) return;

    // Check if 'Muskan' is mentioned or if it's a reply to the bot
    const isMentioningMuskan = body.toLowerCase().includes('muskan');
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    
    if (!isMentioningMuskan && !isReplyToBot) return;

    // User history setup
    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    // Reaction loading
    if (api.setMessageReaction)
        api.setMessageReaction("⌛", messageID, () => { }, true);

    try {
        // Aapki API ke hisaab se POST request (Render backend compatible)
        const response = await axios.post(
            API_URL,
            { 
                message: fullPrompt 
            },
            { 
                timeout: 40000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Aapki API response format ke hisaab se
        const reply = response?.data?.reply || "Uff! Mujhe samajh nahi ai baby! 😕";

        // Save into chat history
        history[senderID].push(`Bot: ${reply}`);

        // Send reply
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("✅", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Oops baby! 😔 me thori confuse ho gayi… thori der baad try karo na please! 💋",
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("❌", messageID, () => { }, true);
    }
};
