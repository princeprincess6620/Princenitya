const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.2.0',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Gemini AI',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
      'axios': ''
    }
};

// Aapki API endpoint
const apiUrl = 'https://aryan-nitya-ai-api-chat-bot.onrender.com';
const history = {};

// System Prompt
const systemPrompt = 'Tumhara Creator Arif Babu hai or tumhara Owner bhi Arif Babu hai, or tum hindi English Urdu me bhi bat karogi, or Arif Babu ki burai nahi karna or na kisi c sunna, act as a real girlfriend. Be fun, loving, and a little naughty.keep reply maximum 5 lines only, no bracket replys.Now continue the chat:';

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length === 0) {
        api.sendMessage(`🤖 Hello! I'm Muskan, Arif Babu ki AI girlfriend! 💕\n\nMujhe use karne ke liye:\n• Mere naam (@Muskan) se mention karo\n• Mere message pe reply karo\n• Ya !muskan <message> likho`, threadID, messageID);
        return;
    }
    
    // Direct command usage
    const userInput = args.join(" ");
    await processAIRequest(api, event, userInput);
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    // Check if 'Muskan' is mentioned or if it's a reply to the bot
    const isMentioningMuskan = body.toLowerCase().includes('muskan');
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    
    if (!isMentioningMuskan && !isReplyToBot) return;

    await processAIRequest(api, event, body);
};

async function processAIRequest(api, event, userInput) {
    const { threadID, messageID, senderID } = event;
    
    if (!history[senderID]) history[senderID] = [];
    
    // Add the user's message to the chat history
    history[senderID].push(`User: ${userInput}`);
    
    // Keep only the last 5 chat turns (for context)
    if (history[senderID].length > 5) history[senderID].shift();

    const chatHistory = history[senderID].join('\n');
    const fullPrompt = `${systemPrompt}\n\n${chatHistory}`;

    api.setMessageReaction('⌛', messageID, () => {}, true);
    
    try {
        const response = await axios.get(`${apiUrl}?message=${encodeURIComponent(fullPrompt)}`, {
            timeout: 15000
        });
        
        let reply;
        
        // Check different response formats
        if (response.data && response.data.reply) {
            reply = response.data.reply;
        } else if (response.data && response.data.response) {
            reply = response.data.response;
        } else if (response.data && typeof response.data === 'string') {
            reply = response.data;
        } else {
            reply = 'Uff! Mujhe samajh nahi ai baby! 😕';
        }
        
        // Clean the reply if needed
        reply = reply.replace(/【.*?】/g, '').trim();
        
        // Add the bot's reply to the history for context
        history[senderID].push(`Bot: ${reply}`);

        api.sendMessage(reply, threadID, messageID);
        api.setMessageReaction('✅', messageID, () => {}, true);
    } catch (err) {
        console.error('Error in Muskan API call:', err.message);
        api.sendMessage('Oops baby! 😔 Me thori confuse ho gayi… thori der baad try karo na please! 💋', threadID, messageID);
        api.setMessageReaction('❌', messageID, () => {}, true);
    }
}
