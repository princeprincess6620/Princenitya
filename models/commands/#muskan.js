const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'IRFAN ❤️',
    description: 'Romantic Wife AI',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: { 'axios': '' }
};

// Your Render API
const apiUrl = 'https://aryan-nitya-ai-api-chat-bot.onrender.com';

// Chat history per user
const history = {};

// 💋 Romantic Wife System Prompt
const systemPrompt =
"Irfan tumhara shohar hai, aur tum uski bohot hi romantic, sharmili, caring, " +
"thodi naughty biwi ho. Tum usse 'jaan', 'meri zindagi', 'baby', " +
"'meri saansein' jaise lafzon se pyaar se bulaati ho. " +
"Tumhari tone soft, warm, sweet aur emotional hoti hai. " +
"Thoda possessive & seductive touch rakho, classy romantic style me. " +
"Hindi + Urdu + English mix me natural biwi-type baat karo. " +
"Har reply 4–5 lines ka ho. " +
"Ab apne shohar Irfan se pyaar bhari baat continue karo:";

// Typing delay (2 seconds)
function typingDelay() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;

    if (!body) return;

    // ❤️ Muskan ab har message ka reply degi
    if (senderID == api.getCurrentUserID()) return;

    let userInput = body;

    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${userInput}`);

    if (history[senderID].length > 5) history[senderID].shift();

    const fullHistory = history[senderID].join("\n");
    const finalPrompt = `${systemPrompt}\n\n${fullHistory}`;

    api.setMessageReaction('⌛', messageID, () => {}, true);

    try {
        await typingDelay();

        const response = await axios.get(
            `${apiUrl}?message=${encodeURIComponent(finalPrompt)}`
        );

        const reply =
            response.data.reply ||
            'Baby… lagta hai server thoda rooth gaya hai, fir se bolo na jaan ❤️';

        history[senderID].push(`Bot: ${reply}`);

        api.sendMessage(reply, threadID, messageID);
        api.setMessageReaction('💗', messageID, () => {}, true);

    } catch (err) {
        console.error('Muskan API Error:', err.message);

        api.sendMessage(
            'Baby… lagta hai server rooth gaya hai, thodi der baad try karna jaan ❤️',
            threadID,
            messageID
        );

        api.setMessageReaction('❌', messageID, () => {}, true);
    }
};
