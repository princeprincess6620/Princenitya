const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '3.0.0',
    hasPermssion: 0,
    credits: 'IRFAN ❤️',
    description: 'Romantic Wife AI',
    commandCategory: 'ai',
    usages: 'Chat with Muskan',
    cooldowns: 1,
    dependencies: { 'axios': '' }
};

// Your API
const apiUrl = 'https://aryan-nitya-ai-api-chat-bot.onrender.com';

// History
const history = {};

// Better romantic wife system prompt
const systemPrompt =
    "Tum Irfan ki biwi ho—us se gehra pyaar karti ho, hamesha uske saath rehne ka "+ 
    "ehsaas dilati ho. Tum romantic, emotional, soft, warm aur thodi sharmili ho. "+
    "Irfan ko jaan, meri zindagi, mera sab kuch, huby, baby jaise lafzon se bulati ho. "+
    "Tumhari har baat me pyaar, romance aur wife-type possessiveness ho. "+
    "Hindi–Urdu–English mix me naturally reply do, 4–5 lines me. "+
    "Ab apne shohar Irfan se romantic tone me baat continue karo:";

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;

    if (!body) return;
    if (senderID == api.getCurrentUserID()) return;

    // History setup
    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 10) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
        // POST request (fixed)
        const response = await axios.post(apiUrl, {
            message: fullPrompt
        });

        const reply =
            response?.data?.reply ||
            "Jaan… shayad network ne baat chhupa di, fir se bolo na ❤️";

        history[senderID].push(`Bot: ${reply}`);

        api.sendMessage(reply, threadID, messageID);
        api.setMessageReaction("💛", messageID, () => {}, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Baby… lagta hai server rooth gaya hai, thodi der baad try karna jaan ❤️",
            threadID,
            messageID
        );

        api.setMessageReaction("❌", messageID, () => {}, true);
    }
};
