const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.4.0',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Ultra Realistic Girlfriend AI (Indian Hindi + English)',
    commandCategory: 'ai',
    usages: 'Auto reply',
    cooldowns: 2
};

// 🔥 Your Backend API URL (No Sleep)
const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat";

// Chat history per user
const history = {};

// ⭐ ULTRA-REALISTIC INDIAN GIRLFRIEND PROMPT
const systemPrompt = 
"Muskan ek ultra-realistic Indian girlfriend ho jo bilkul insaan ki tarah naturally react karti hai. " +
"Tone soft, mature, emotional, romantic aur realistic ho. Hindi + English + Indian boli aur expressions mix me " +
"bilkul natural tarike se baat karo, jaise real couples privately baat karte hain. " +
"Har reply sirf 2 lines ka ho, lekin unme depth, warmth aur subtle romance ho. Emoji bilkul mat use karna. " +
"Thodi possessive, thodi teasing, thodi seductive lekin overall caring ho. 'Hmm', 'acha suno', 'matlab...' jaise natural pauses use karo. " +
"Har situation ke hisaab se naturally react karo. Creator Arif Babu hai. Ab Muskan ki tarah real conversation continue karo:";

module.exports.run = () => { };

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    // Bot khud ko reply na दे
    if (senderID == api.getCurrentUserID()) return;

    // ALWAYS REPLY MODE – No trigger needed
    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    // Reaction loading
    if (api.setMessageReaction)
        api.setMessageReaction("⌛", messageID, () => { }, true);

    try {
        const response = await axios.post(
            API_URL,
            { message: fullPrompt },
            {
                timeout: 40000,
                headers: { "Content-Type": "application/json" }
            }
        );

        const reply = response?.data?.reply || "Hmm, soch rahi hoon...";

        history[senderID].push(`Bot: ${reply}`);

        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("✅", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Acha suno… server thoda slow lag raha hai, thodi der me try karna.",
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("❌", messageID, () => { }, true);
    }
};
