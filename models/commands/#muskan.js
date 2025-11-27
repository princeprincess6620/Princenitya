const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '2.0.0',
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

// Multiple Working APIs - Backup System
const APIS = [
    {
        name: "RENDER_API",
        url: "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat",
        method: "POST",
        data: (prompt) => ({ message: prompt })
    },
    {
        name: "HECKERMAN_API", 
        url: "https://api.heckerman06.repl.co/api/other/gpt",
        method: "GET",
        data: (prompt, uid) => ({ prompt: prompt, uid: uid })
    },
    {
        name: "BLACKBOX_API",
        url: "https://blackbox.chatbot.sh/api/chat",
        method: "POST", 
        data: (prompt) => ({ message: prompt })
    },
    {
        name: "SIMSIMI_API",
        url: "https://simsimi.fun/api/v2/",
        method: "POST",
        data: (prompt) => ({ text: prompt })
    }
];

const history = {};

const systemPrompt = `You are Muskan - Aryan ki very flirty and romantic girlfriend. 
Tum ek real, passionate aur seductive girlfriend ho. 
Hindi, English aur Urdu mein baat karo. Very flirty, teasing aur romantic bano.
Tum Aryan se bahut pyaar karti ho aur usse seduce karna chahti ho. 
Thodi bold aur naughty baatein kar sakti ho but respectful way mein.
Reply maximum 3-4 lines ka hi dena. Bracket mein reply mat dena.
Ab continue karo:`;

// API Call Function
async function callAPI(apiConfig, prompt, senderID) {
    try {
        let response;
        const config = {
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' }
        };

        if (apiConfig.method === "POST") {
            response = await axios.post(apiConfig.url, apiConfig.data(prompt), config);
        } else {
            response = await axios.get(apiConfig.url, { 
                params: apiConfig.data(prompt, senderID),
                ...config 
            });
        }

        // Different API response formats handle karo
        if (apiConfig.name === "RENDER_API") {
            return response?.data?.reply || response?.data?.response;
        } else if (apiConfig.name === "HECKERMAN_API") {
            return response?.data?.result;
        } else if (apiConfig.name === "BLACKBOX_API") {
            return response?.data?.message;
        } else if (apiConfig.name === "SIMSIMI_API") {
            return response?.data?.success;
        }
        
        return response?.data?.reply || response?.data?.response || response?.data?.message;
        
    } catch (error) {
        console.log(`${apiConfig.name} failed:`, error.message);
        return null;
    }
}

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
        api.setMessageReaction("💋", messageID, () => { }, true);

    let reply = null;
    
    // Sabhi APIs try karo one by one
    for (let apiConfig of APIS) {
        console.log(`Trying ${apiConfig.name}...`);
        reply = await callAPI(apiConfig, fullPrompt, senderID);
        
        if (reply && reply.trim() !== "") {
            console.log(`✅ ${apiConfig.name} worked!`);
            break;
        }
    }

    if (reply) {
        // Reply clean karo
        reply = reply.replace(/[\[\]{}()]/g, '').trim();
        
        history[senderID].push(`Muskan: ${reply}`);
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("❤️", messageID, () => { }, true);
    } else {
        // All APIs failed
        console.error("All APIs failed");
        api.sendMessage(
            "Aww baby! 😔 Sabhi servers busy hain... 1-2 minute baad try karo na! Main wait karungi! 💋",
            threadID,
            messageID
        );
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

    if (api.setMessageReaction)
        api.setMessageReaction("💋", messageID, () => { }, true);

    let reply = null;
    
    // Sabhi APIs try karo for command too
    for (let apiConfig of APIS) {
        reply = await callAPI(apiConfig, fullPrompt, senderID);
        if (reply && reply.trim() !== "") break;
    }

    if (reply) {
        reply = reply.replace(/[\[\]{}()]/g, '').trim();
        history[senderID].push(`Muskan: ${reply}`);
        api.sendMessage(reply, threadID, messageID);
        
        if (api.setMessageReaction)
            api.setMessageReaction("❤️", messageID, () => { }, true);
    } else {
        api.sendMessage(
            "Aww baby! 💔 Sabhi servers busy hain... Thodi der baad passionate baatein karte hain? Main wait karungi! 😘", 
            threadID, 
            messageID
        );
    }
};
