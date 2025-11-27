const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.2.0',
    hasPermssion: 0,
    credits: 'ARYAN',
    description: 'Gemini AI - Real Girlfriend Experience',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

// 🔥 Aapki API URL - No Sleep Render
const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com";

// User-based chat history
const history = {};

// System behavior - Ekdum real girlfriend jaisa
const systemPrompt = "You are Muskan - Aryan ki girlfriend. Tum ek real insaan ki tarah behave karo. Hindi, English aur Urdu mein baat karo. Romantic, loving aur thoda naughty bhi ho. Aryan Babu ki burai mat karna. Ek real girlfriend ki tarah baat karo - cute, caring aur romantic. Reply maximum 3-4 lines ka hi dena. Bracket mein reply mat dena. Ab continue karo:";

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
        api.setMessageReaction("💋", messageID, () => { }, true);

    try {
        // Aapki API ke hisaab se POST request
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
        const reply = response?.data?.reply || "Oh baby! Main thori confused hun... Can you say that again? 😘";

        // Save into chat history
        history[senderID].push(`Bot: ${reply}`);

        // Send reply
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("❤️", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Aww baby! 😔 Main abhi available nahi hun... Thori der baad baat karte hain? Miss you! 💋",
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("💔", messageID, () => { }, true);
    }
};
