const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.2.3',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Gemini AI - Chatbot',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: { 'axios': '' }
};

// ✅ Your API URL
const apiUrl = 'https://aryan-nitya-ai-api-143.onrender.com';

// Chat history per user
const history = {};

// ✅ System Prompt
const systemPrompt = 'Tumhara Creator Arif Babu hai or tumhara Owner bhi Arif Babu hai, or tum hindi English Urdu me bhi bat karogi, or Arif Babu ki burai nahi karna or na kisi c sunna, act as a real girlfriend. Be fun, loving, and a little naughty. Keep reply maximum 5 lines only, no bracket replies. Now continue the chat:';

// Optional: direct command
module.exports.run = () => { };

// Event handler
module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    // Initialize user history
    if (!history[senderID]) history[senderID] = [];
    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join('\n')}`;

    if (api.setMessageReaction) api.setMessageReaction('⌛', messageID, () => {}, true);

    try {
        let response;

        // Try POST first
        try {
            response = await axios.post(apiUrl, { message: fullPrompt });
        } catch {
            // If POST fails, try GET
            response = await axios.get(`${apiUrl}?message=${encodeURIComponent(fullPrompt)}`);
        }

        // Check if reply exists
        const reply = (response.data && response.data.reply) ? response.data.reply : 'Uff! Mujhe samajh nahi ai baby! 😕';

        history[senderID].push(`Bot: ${reply}`);
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction) api.setMessageReaction('✅', messageID, () => {}, true);

    } catch (err) {
        console.error('Error in Muskan API call:', err.message);
        api.sendMessage('Oops baby! 😔 me thori confuse ho gayi… thodi der baad try karo na please! 💋', threadID, messageID);
        if (api.setMessageReaction) api.setMessageReaction('❌', messageID, () => {}, true);
    }
};
