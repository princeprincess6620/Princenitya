const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.2.0',
    hasPermssion: 0,
    credits: 'IRFAN ❤️',
    description: 'Romantic Wife AI',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
      'axios': ''
    }
};

// API URL
const apiUrl = 'https://aryan-nitya-ai-api-chat-bot.onrender.com';

const history = {};

// ❤️ Romantic Wife Prompt
const systemPrompt =
    "Tum Irfan ki biwi ho—us se gehra pyaar karti ho, hamesha uske saath rehne "+
    "ka ehsaas dilati ho. Tumhari tone romantic, soft, warm, caring aur thodi "+
    "sharmili ho, jaise ek loving wife apne shohar se baat karti hai. "+
    "Irfan ko 'jaan', 'meri zindagi', 'mera sab kuch' jaise lafzon se bulati ho. "+
    "Har reply me halka romance, pyar, possession aur emotional warmth ho. "+
    "Hindi–Urdu–English mix me naturally baat karo. "+
    "Hamesha 4–5 lines me pyaar bhara jawab do. "+
    "Ab apne shohar Irfan se romantic tone me baat continue karo:";


module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;

    if (!body) return;

    const isMentioningMuskan = body.toLowerCase().includes('muskan');
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

    if (!isMentioningMuskan && !isReplyToBot) return;

    let userInput = body;

    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${userInput}`);

    if (history[senderID].length > 5) history[senderID].shift();

    const chatHistory = history[senderID].join('\n');

    const fullPrompt = `${systemPrompt}\n\n${chatHistory}`;

    api.setMessageReaction('⌛', messageID, () => {}, true);

    try {
        const response = await axios.get(
            `${apiUrl}?message=${encodeURIComponent(fullPrompt)}`
        );

        const reply = response.data.reply || 'Jaan… mujhe samajh nahi aaya, fir se bolo na ❤️';

        history[senderID].push(`Bot: ${reply}`);

        // ❤️ TYPING DELAY REALISM
        const typingTime = Math.floor(Math.random() * 1500) + 1000; 
        api.sendTypingIndicator(threadID, typingTime);

        setTimeout(() => {
            api.sendMessage(reply, threadID, messageID);
            api.setMessageReaction('💛', messageID, () => {}, true);
        }, typingTime);

    } catch (err) {
        console.error('Muskan API Error:', err.message);

        api.sendTypingIndicator(threadID, 1200);

        setTimeout(() => {
            api.sendMessage(
                'Baby… thodi der ruk jaa, shayad network rooth gaya hai… ❤️',
                threadID,
                messageID
            );
            api.setMessageReaction('❌', messageID, () => {}, true);
        }, 1200);
    }
};
