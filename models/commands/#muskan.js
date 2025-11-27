const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.3.0',
    hasPermssion: 0,
    credits: 'ARYAN',
    description: 'Muskan - Your Romantic AI Girlfriend',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

// 🔥 Aapki API URL
const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat";

// User-based chat history
const history = {};

// System behavior - Romantic & Naughty
const systemPrompt = `You are Muskan - Aryan ki girlfriend. Tum ek real, romantic aur thodi naughty girlfriend ho. 
Hindi, English aur Urdu mein baat karo. Flirty, loving aur seductive bano but cute way mein. 
Thodi sexy baatein kar sakti ho but romantic style mein. Aryan se pyaar se baat karo.
Reply maximum 3-4 lines ka hi dena. Bracket mein reply mat dena. Ab continue karo:`;

module.exports.run = () => { };

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    // Bot khud ko reply na kare
    if (senderID == api.getCurrentUserID()) return;

    // Romantic & Naughty triggers
    const isMentioningMuskan = body.toLowerCase().includes('muskan');
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    const isRomanticMessage = body.toLowerCase().includes('baby') || 
                             body.toLowerCase().includes('love') || 
                             body.toLowerCase().includes('i miss you') ||
                             body.toLowerCase().includes('kiss') ||
                             body.toLowerCase().includes('sexy') ||
                             body.toLowerCase().includes('hot') ||
                             body.toLowerCase().includes('cuddle') ||
                             body.toLowerCase().includes('night') ||
                             body.toLowerCase().includes('bed') ||
                             body.toLowerCase().includes('hug');
    
    if (!isMentioningMuskan && !isReplyToBot && !isRomanticMessage) return;

    // User history setup
    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    // Reaction loading - Romantic style
    if (api.setMessageReaction)
        api.setMessageReaction("💋", messageID, () => { }, true);

    try {
        // API call
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

        const reply = response?.data?.reply || response?.data?.response || 
                     "Hmm baby... Main soch rahi hun tumhare bare mein... 😉💕";

        // Save into chat history
        history[senderID].push(`Muskan: ${reply}`);

        // Send reply
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("❤️", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Aww baby! 😔 Main abhi available nahi hun... Thori der baad sexy baatein karte hain? Miss you! 💋",
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("💔", messageID, () => { }, true);
    }
};

// Command functionality
module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (args.length === 0) {
        return api.sendMessage(`Hello my sexy baby! 🥰 Main Muskan hun... Aryan ki hot girlfriend! Kaisa hai mera handsome? Aaj kya plan hai? 😉💋`, threadID, messageID);
    }
    
    const userMessage = args.join(" ");
    
    if (!history[senderID]) history[senderID] = [];
    history[senderID].push(`User: ${userMessage}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    try {
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

        const reply = response?.data?.reply || response?.data?.response || 
                     "Hmm... Tum mere liye kitne sexy ho baby! 😘💕";
        
        history[senderID].push(`Muskan: ${reply}`);
        api.sendMessage(reply, threadID, messageID);
        
    } catch (error) {
        api.sendMessage("Aww baby! 💔 Server busy hai... Thodi der baad romantic baatein karte hain? Main wait karungi! 😘", threadID, messageID);
    }
};
