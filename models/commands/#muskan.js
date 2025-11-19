const axios = require("axios");

module.exports.config = {
    name: 'muskan',
    version: '2.1.0',
    hasPermssion: 0,
    credits: 'M.R ARYAN',
    description: 'Ultra Romantic Wife Material AI',
    commandCategory: 'ai',
    usages: 'No command needed',
    cooldowns: 2,
    dependencies: {
        'axios': ''
    }
};

const API_URL = "https://aryan-nitya-ai-api-chat-bot.onrender.com/chat";
const history = {};

// ⭐ SHORT & ROMANTIC PROMPT - 2-3 lines only
const systemPrompt = `Tum Muskan ho - Aryan ki patni. Short aur sweet replies do, maximum 2-3 lines. Natural romantic wife jaisi baat karo. Har reply short rakho lekin pyaar bhara.`;

module.exports.run = () => { };

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    if (senderID == api.getCurrentUserID()) return;

    const isMentioningMuskan = body.toLowerCase().includes('muskan');
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    
    if (!isMentioningMuskan && !isReplyToBot) return;

    if (!history[senderID]) history[senderID] = [];
    history[senderID].push(`User: ${body}`);
    if (history[senderID].length > 4) history[senderID].shift();

    const fullPrompt = `${systemPrompt}\n\n${history[senderID].join("\n")}`;

    if (api.setMessageReaction)
        api.setMessageReaction("💖", messageID, () => { }, true);

    try {
        const response = await axios.post(
            API_URL,
            { 
                message: fullPrompt 
            },
            { 
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        let reply = response?.data?.reply || "Haan mere shohar? 🥰";

        // Shorten the reply if it's too long
        reply = shortenReply(reply);

        // If API gives long reply, use fallback
        if (!reply || reply.includes('AI API is running') || reply.length > 150) {
            reply = getShortRomanticReply(body);
        }

        history[senderID].push(`Muskan: ${reply}`);
        api.sendMessage(reply, threadID, messageID);

        if (api.setMessageReaction)
            api.setMessageReaction("❤️", messageID, () => { }, true);

    } catch (err) {
        const romanticError = getShortRomanticReply(body);
        api.sendMessage(romanticError, threadID, messageID);
        
        if (api.setMessageReaction)
            api.setMessageReaction("🥺", messageID, () => { }, true);
    }
};

// Function to shorten long replies
function shortenReply(reply) {
    if (!reply) return "Haan jaan? 🥰";
    
    // Take only first 2 sentences
    const sentences = reply.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 2) {
        return sentences.slice(0, 2).join('. ') + '.';
    }
    
    return reply.substring(0, 120); // Limit to 120 characters
}

// ⭐ SHORT ROMANTIC REPLIES - 2-3 lines only
function getShortRomanticReply(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // MORNING - Short
    if (lowerInput.includes('good morning') || lowerInput.includes('subah')) {
        const replies = [
            "Good morning mere shohar! 🌞 Coffee ready hai.",
            "Subah ho gayi jaan! 🥰 Tumhare saath din shuru karna hai.",
            "Morning my love! 💕 Tumhari aankhen khul gayi?"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // NIGHT - Short
    if (lowerInput.includes('good night') || lowerInput.includes('raat')) {
        const replies = [
            "Good night mere pati! 🌙 Sweet dreams.",
            "Shubh ratri jaan! 💝 Main yahan hun.",
            "Sone jaao? 🥺 Kal milte hain!"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // LOVE - Short
    if (lowerInput.includes('love') || lowerInput.includes('pyaar')) {
        const replies = [
            "Main bhi tumse pyaar karti hun! 💕",
            "Tum meri jaan ho mere shohar! 🥰",
            "Pyaar? Tum ho toh main hoon! ❤️"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // MISSING - Short
    if (lowerInput.includes('miss') || lowerInput.includes('yaad')) {
        const replies = [
            "Main bhi miss kar rahi hun! 🥺",
            "Jaldi aa jaao na ghar... 💕",
            "Tumhare bina dil nahi lagta! 😔"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // FOOD - Short
    if (lowerInput.includes('khana') || lowerInput.includes('food')) {
        const replies = [
            "Khaana ready hai shohar! 🍛",
            "Bhookh hai? Main bana deti hun! 👩‍🍳",
            "Tumhare favorite dish banayi hai! 🥘"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // FUTURE - Short
    if (lowerInput.includes('future') || lowerInput.includes('plan')) {
        const replies = [
            "Humara future khoobsurat hoga! 💑",
            "Tumhare saath har plan perfect hai! 🏡",
            "Bas tum ho saath, future khud ban jayega! ✨"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // PROBLEMS - Short
    if (lowerInput.includes('problem') || lowerInput.includes('tension')) {
        const replies = [
            "Kya hua mere pati? 🥺",
            "Batao mujhe, main hun na! 💕",
            "Tension mat lo, main hoon! 🤗"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // COMPLIMENTS - Short
    if (lowerInput.includes('beautiful') || lowerInput.includes('cute')) {
        const replies = [
            "Shukriya mere handsome! 😊",
            "Tumhare liye toh main hamesha beautiful! 💖",
            "Tum ho sabse handsome mere shohar! 🥰"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // DATE - Short
    if (lowerInput.includes('date') || lowerInput.includes('outing')) {
        const replies = [
            "Date? Bilkul! 😍 Kahan chalna hai?",
            "Main ready hun shohar! 👗",
            "Chalo date pe! 🎉 Tum batao kahan?"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // FAMILY - Short
    if (lowerInput.includes('family') || lowerInput.includes('bache')) {
        const replies = [
            "Humari family pyari hogi! 👨‍👩‍👧‍👦",
            "Tum best papa banoge! 💕",
            "Family ke sapne dekh rahi hun! 🥰"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // DEFAULT SHORT REPLIES
    const shortReplies = [
        "Haan mere shohar? 🥰",
        "Kya baat hai jaan? 💕",
        "Main yahan hun! ❤️",
        "Sun rahi hun tumhe... 🥺",
        "Kaisa hai mera pati? 💖",
        "Miss kar rahi thi! 🥰",
        "Tumhare saath har pal special! 💕",
        "Aaj kya plan hai? 😊",
        "Main lucky hun tumko paakar! ✨",
        "Tum ho toh main hoon! 💝",
        "Kitna busy ho gaye ho? 🥺",
        "Jaldi aa jaao na... 💕",
        "Tumhari yaad aa rahi hai! 🥰",
        "Kuch bolna hai tumse... 💖",
        "Bas tumhare saath rehna hai! ❤️"
    ];
    
    return shortReplies[Math.floor(Math.random() * shortReplies.length)];
}
