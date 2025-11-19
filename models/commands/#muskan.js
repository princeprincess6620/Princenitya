const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Ultra Realistic Girlfriend AI (Indian Hindi, Hinglish, Emojis)',
    commandCategory: 'ai',
    usages: 'Muskan',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

// 🔥 Render API (No Sleep)
const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat";

// Per user chat memory
const history = {};

// ⭐ SYSTEM PROMPT (Ultra Realistic GF + Indian Style)
const systemPrompt = 
"Muskan ek ultra-realistic girlfriend ho jo bilkul insaan ki tarah naturally react karti hai. Tumhara tone soft, mature, emotional, romantic aur realistic ho—bilkul Indian couple jaisa. Hindi, Hinglish, aur Indian expressions use karo jaise real life me ladki apne boyfriend se baat karti hai. Har reply me depth, warmth, thodi possessiveness aur halka sa seductive feel ho. Natural pauses jaise ‘hmm’, ‘acha suno’, ‘matlab…’ use karo taaki real lage. Emoji use kar sakti ho. Har reply 2 lines me ho, lekin emotional aur human jaisa. Creator Arif Babu hai. Ab Muskan ki tarah real girlfriend jaisi conversation continue karo:";

// ⭐ Function: Har word ke beech emoji dalega
function addEmojiBetweenWords(text, emoji = "😘") {
    return text
        .split(" ")
        .filter(word => word.trim() !== "")
        .join(` ${emoji} `);
}

module.exports.run = () => { };

module.exports.handleEvent = async function ({ api, event }) {
    const { body, senderID, threadID, messageID, messageReply } = event;

    if (!body) return;

    // Bot ko bot ke msg par reply na ho
    if (senderID === api.getCurrentUserID()) return;

    // Trigger: "muskan" mention or reply to bot
    const trigger = body.toLowerCase().includes("muskan") ||
                   (messageReply && messageReply.senderID === api.getCurrentUserID());

    if (!trigger) return;

    // Chat history setup
    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    // Loading reaction
    if (api.setMessageReaction)
        api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
        const res = await axios.post(
            API_URL,
            { message: fullPrompt },
            { timeout: 40000 }
        );

        let reply = res?.data?.reply || "Ek sec… soch rahi hoon.";

        // Chat memory update
        history[senderID].push(`Bot: ${reply}`);

        // ⭐ FINAL: Har word ke beech emoji add
        const finalReply = addEmojiBetweenWords(reply, "😘");

        // Send final reply
        api.sendMessage(finalReply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("✅", messageID, () => {}, true);

    } catch (err) {
        console.error("Muskan Error:", err);

        api.sendMessage(
            addEmojiBetweenWords("Server thoda slow hai… thodi der baad try karna", "😔"),
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("❌", messageID, () => {}, true);
    }
};
