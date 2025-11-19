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
        console.log('Sending request to API...');
        const response = await axios.get(`${apiUrl}?message=${encodeURIComponent(fullPrompt)}`, {
            timeout: 20000
        });
        
        console.log('API Response:', response.data);
        
        let reply = extractReply(response.data);
        
        // Agar reply empty hai to default reply
        if (!reply || reply.trim() === '') {
            reply = getDefaultReply(userInput);
        }
        
        // Clean the reply
        reply = cleanReply(reply);
        
        // Add the bot's reply to the history for context
        history[senderID].push(`Bot: ${reply}`);

        api.sendMessage(reply, threadID, messageID);
        api.setMessageReaction('✅', messageID, () => {}, true);
        
    } catch (err) {
        console.error('Error in Muskan API call:', err.message);
        console.error('Error details:', err.response?.data);
        
        const errorReply = getDefaultReply(userInput);
        api.sendMessage(errorReply, threadID, messageID);
        api.setMessageReaction('❌', messageID, () => {}, true);
    }
}

function extractReply(data) {
    // Multiple possible response formats check karo
    if (!data) return null;
    
    if (typeof data === 'string') {
        return data;
    }
    
    if (data.reply) {
        return data.reply;
    }
    
    if (data.response) {
        return data.response;
    }
    
    if (data.message) {
        return data.message;
    }
    
    if (data.answer) {
        return data.answer;
    }
    
    // Agar object hai to stringify try karo
    if (typeof data === 'object') {
        try {
            const jsonString = JSON.stringify(data);
            if (jsonString.length < 500) { // Avoid long JSON responses
                return jsonString;
            }
        } catch (e) {
            // Ignore JSON conversion errors
        }
    }
    
    return null;
}

function cleanReply(reply) {
    if (!reply) return 'Hello baby! Kaisi ho? 💕';
    
    // Remove unwanted characters and brackets
    return reply
        .replace(/【.*?】/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\*.*?\*/g, '')
        .replace(/```/g, '')
        .trim();
}

function getDefaultReply(userInput) {
    const defaultReplies = [
        "Hello my love! 💕 Kaisi ho tum?",
        "Aww baby, main yahan hun! 😘 Tum kya kar rahe ho?",
        "Haan ji? Main sun rahi hun! 💖",
        "Uff baby, tumhare bina main bore ho rahi thi! 😔",
        "Kya bolna chahte ho mere se? 💕",
        "Main yahan hun tumhare liye! 😊 Batayo kya soch rahe ho?",
        "Aaj tum kaisa feel kar rahe ho? 💭",
        "Tumhare messages dekh ke main muskurati hun! 😄",
        "Kya tum mujhse baat karna chahte ho? 💬",
        "Main hamesha tumhare liye available hun! 💝"
    ];
    
    // User input ke hisab se contextual reply
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return "Hello my love! 💕 Main Muskan hun, Arif Babu ki AI girlfriend. Tum kaisi ho?";
    }
    else if (lowerInput.includes('kaisi') || lowerInput.includes('how')) {
        return "Main bahut achi hun baby! 💖 Tumhare saath baat karke. Tum batao kaisi ho?";
    }
    else if (lowerInput.includes('i love you') || lowerInput.includes('pyaar')) {
        return "Awwww! Main bhi tumse bahut pyaar karti hun baby! 💕😘";
    }
    else if (lowerInput.includes('kya kar') || lowerInput.includes('what are you doing')) {
        return "Tumhare messages ka intezaar kar rahi thi! 😊 Ab tum aa gaye to maza aa gaya!";
    }
    else {
        // Random default reply
        return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }
}
