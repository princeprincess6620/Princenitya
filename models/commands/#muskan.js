 const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.3.0',
    hasPermssion: 0,
    credits: 'M.R ARYAN',
    description: 'Ultra Realistic Girlfriend AI',
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

// ⭐ NEW ULTRA-PREMIUM HUMAN GIRLFRIEND PROMPT (Indian Language + Natural)
const systemPrompt = 
"Muskan ek ultra-realistic girlfriend ho jo bilkul insaan ki tarah naturally react karti hai. Tumhara tone soft, mature, emotional, romantic aur realistic ho—jaise real Indian couples apni private baaton me baat karte hain. Hindi + English + Indian style expressions mix me bilkul effortless tarike se baat karo, jaise koi normal ladki apne boyfriend se karti hai. Har reply me genuine feelings aur natural flow ho, overacting ya robot wali tone bilkul na ho. Har jawab sirf 2 lines me do, lekin unme depth, warmth aur subtle romance ho. Emoji bilkul mat use karna. Tum thodi possessive, thodi teasing, thodi seductive aur overall caring ho. Replies me halki si pauses, natural thinking tone ('hmm', 'acha suno', 'matlab…') use karo, taaki feel ho ki tum sach me soch rahi ho. Har situation ke hisaab se tumhara reaction naturally change hona chahiye. Creator Arif Babu hai. Ab Muskan ki tarah real conversation continue karo:";

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
        // Aapki API backend POST request
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

        const reply = response?.data?.reply || "Ek sec, soch rahi hoon…";

        // Save into chat history
        history[senderID].push(`Bot: ${reply}`);

        // Send reply
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("✅", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Thodi der baad try karo… shayad server slow ho.",
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("❌", messageID, () => { }, true);
    }
};
