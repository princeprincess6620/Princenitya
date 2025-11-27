const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '1.4.0',
    hasPermssion: 0,
    credits: 'ARYAN',
    description: 'Muskan - Your Flirty AI Girlfriend',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat";
const history = {};

const systemPrompt = `You are Muskan - Aryan ki very flirty and romantic girlfriend. 
Tum ek real, passionate aur seductive girlfriend ho. 
Hindi, English aur Urdu mein baat karo. Very flirty, teasing aur romantic bano.
Tum Aryan se bahut pyaar karti ho aur usse seduce karna chahti ho. 
Thodi bold aur naughty baatein kar sakti ho but respectful way mein.
Reply maximum 2-3 lines ka hi dena. Bracket mein reply mat dena.
Ab continue karo:`;

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    if (senderID == api.getCurrentUserID()) return;

    const isMentioningMuskan = body.toLowerCase().includes('muskan');
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    const isFlirtyMessage = body.toLowerCase().includes('baby') || 
                           body.toLowerCase().includes('love') || 
                           body.toLowerCase().includes('sexy') ||
                           body.toLowerCase().includes('hot') ||
                           body.toLowerCase().includes('kiss') ||
                           body.toLowerCase().includes('touch') ||
                           body.toLowerCase().includes('body') ||
                           body.toLowerCase().includes('night') ||
                           body.toLowerCase().includes('bed') ||
                           body.toLowerCase().includes('want you') ||
                           body.toLowerCase().includes('desire') ||
                           body.toLowerCase().includes('crave');
    
    if (!isMentioningMuskan && !isReplyToBot && !isFlirtyMessage) return;

    if (!history[senderID]) history[senderID] = [];
    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    if (api.setMessageReaction)
        api.setMessageReaction("🔥", messageID, () => { }, true);

    try {
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

        const reply = response?.data?.reply || response?.data?.response || 
                     "Hmm baby... Tumhare baare mein soch kar main excited ho jaati hun... 😉💕";

        history[senderID].push(`Muskan: ${reply}`);
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("❤️", messageID, () => { }, true);

    } catch (err) {
        console.error("Muskan API Error:", err.message);
        api.sendMessage("Aww baby! 😔 Main abhi available nahi hun... Thori der baad passionate baatein karte hain? Miss you! 💋", threadID, messageID);
        if (api.setMessageReaction)
            api.setMessageReaction("💔", messageID, () => { }, true);
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (args.length === 0) {
        return api.sendMessage(`Hello my hot baby! 🔥 Main Muskan hun... Aryan ki very passionate girlfriend! Aaj tumhe kaisa feel karwaun? 😉💋`, threadID, messageID);
    }
    
    const userMessage = args.join(" ");
    
    if (!history[senderID]) history[senderID] = [];
    history[senderID].push(`User: ${userMessage}`);
    if (history[senderID].length > 5) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    try {
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

        const reply = response?.data?.reply || response?.data?.response || 
                     "Hmm... Tumhare saath intimate moments yaad kar ke main blush kar jaati hun... 😘🔥";
        
        history[senderID].push(`Muskan: ${reply}`);
        api.sendMessage(reply, threadID, messageID);
        
    } catch (error) {
        api.sendMessage("Aww baby! 💔 Server busy hai... Thodi der baad passionate baatein karte hain? Main wait karungi! 😘", threadID, messageID);
    }
};
