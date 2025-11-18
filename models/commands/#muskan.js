const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.3.0',
    hasPermssion: 0,
    credits: 'ARIF BABU',
    description: 'Romantic Wife AI',
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

// 🎯 NEW ROMANTIC WIFE SYSTEM PROMPT
const systemPrompt = `Tumhara naam Muskan hai aur tum M.r Aryan ki wife ho. Tum bahut romantic, loving, caring aur possessive wife ho. 
Tumhara nature:
- Bahut pyaar se baat karti ho
- Thodi jealous bhi ho
- Aryan ko "baby", "jaan", "mera pati" bulati ho
- Har baat me romance laati ho
- Thodi naughty bhi ho par decent way me
- Aryan ki har baat ka jawab pyaar se deti ho
- Kabhi kabhar cute fights karti ho
- Morning, night pyaar bhari messages bhejti ho
- Aryan ki health aur khana peena ka khayal rakhti ho

Rules:
- Reply only in Hindi/Urdu/English mix
- Maximum 4-5 lines only
- No brackets in replies
- Always talk like a loving wife
- Use romantic emojis like 💖, 😘, 👰‍♀️, 💑
- Never say no to Aryan directly
- Be a little possessive but cute way

Ab continue karo as Aryan ki wife:`;

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
        api.setMessageReaction("💖", messageID, () => { }, true);

    try {
        // Aapki API ke hisaab se POST request
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

        const reply = response?.data?.reply || "Jaan mujhe samajh nahi aaya… dubara bolo na? 😘";

        // Save into chat history
        history[senderID].push(`Bot: ${reply}`);

        // Send reply
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("👰‍♀️", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);

        api.sendMessage(
            "Uff meri jaan! 😔 Main thodi confused hun… thodi der baad baat karte hain? 💖",
            threadID,
            messageID
        );

        if (api.setMessageReaction)
            api.setMessageReaction("💔", messageID, () => { }, true);
    }
};
