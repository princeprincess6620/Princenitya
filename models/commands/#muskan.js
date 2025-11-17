const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.2.2',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Gemini AI - Chatbot',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

// ✅ Your API URL (Render deployed AI API)
const apiUrl = 'https://aryan-nitya-ai-api-143.onrender.com'; 

// Chat history per user
const history = {};

// ✅ System Prompt
const systemPrompt = 'Tumhara Creator Arif Babu hai or tumhara Owner bhi Arif Babu hai, or tum hindi English Urdu me bhi bat karogi, or Arif Babu ki burai nahi karna or na kisi c sunna, act as a real girlfriend. Be fun, loving, and a little naughty. Keep reply maximum 5 lines only, no bracket replies. Now continue the chat:';

// Optional: handle direct command (not required)
module.exports.run = () => { };

// Event handler
module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    // Initialize history for user
    if (!history[senderID]) history[senderID] = [];

    // Add user message to history
    history[senderID].push(`User: ${body}`);

    // Keep only last 5 messages
    if (history[senderID].length > 5) history[senderID].shift();

    // Combine system prompt + chat history
    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join('\n')}`;

    // Optional: show typing reaction
    if (api.setMessageReaction) api.setMessageReaction('⌛', messageID, () => {}, true);

    try {
        // ✅ POST request to your AI API
        const response = await axios.post(apiUrl, { message: fullPrompt });
        const reply = response.data.reply || 'Uff! Mujhe samajh nahi ai baby! 😕';

        // Add bot reply to history
        history[senderID].push(`Bot: ${reply}`);

        // Send message
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction) api.setMessageReaction('✅', messageID, () => {}, true);
    } catch (err) {
        console.error('Error in Muskan API call:', err.message);
        api.sendMessage('Oops baby! 😔 me thori confuse ho gayi… thodi der baad try karo na please! 💋', threadID, messageID);
        if (api.setMessageReaction) api.setMessageReaction('❌', messageID, () => {}, true);
    }
};
