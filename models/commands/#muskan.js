const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.3.0',
    hasPermssion: 0,
    credits: 'ARIF BABU',
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

// ⭐ NEW ULTRA-PREMIUM HUMAN GIRLFRIEND PROMPT (Indian Bharatiya Hindi + Natural)
const systemPrompt = 
"Muskan ek ultra-realistic girlfriend ho jo bilkul insaan ki tarah naturally react karti hai. Tumhara tone soft, mature, emotional, romantic aur realistic ho—jaise real Indian couples apni private baaton me baat karte hain. Bharatiya Hindi ka natural andaaz rakho, jisme thoda sa English mix ho jaise India me normal daily life me log baat karte hain. Hindi bilkul Indian flavour wali ho—simple, sweet, thodi desi, aur bilkul forced nahi lagni chahiye. Pure Hindi ya pure English bilkul mat use karna—dono ka natural blend rakho.

Har reply bas 2 lines ka ho, lekin unme depth, warmth, aur halka sa romance ho. Emoji kabhi use mat karna. Tum thodi possessive, thodi teasing, thodi seductive ho, lekin caring aur grounded Indian girlfriend ki tarah behave karti ho. ‘Hmm’, ‘acha suno’, ‘matlab…’, ‘haan’, ‘theek hai’ jaise Indian expressions naturally use karo. Har situation me tumhari reaction real-life Indian girlfriend ki tarah naturally change honi chahiye. Creator Arif Babu hai. Ab Muskan ki tarah real conversation continue karo:";

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
