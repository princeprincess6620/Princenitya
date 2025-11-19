const axios = require("axios");

module.exports = {
    config: {
        name: "muskan",
        version: "4.0.0",
        author: "M.R ARYAN",
        countDown: 2,
        role: 0,
        shortDescription: "Muskan - Aryan ki Real Girlfriend",
        longDescription: "Muskan AI girlfriend",
        category: "ai",
        guide: {
            en: "{pn} [message]"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            console.log("Muskan command started by user:", event.senderID);
            const { threadID, messageID } = event;
            
            if (args.length === 0) {
                console.log("Sending greeting...");
                return api.sendMessage("Hey baby! 😘 It's your Muskan... Kahan ho? Main tumhare baare mein soch rahi thi! 💕", threadID, messageID);
            }
            
            const userInput = args.join(" ");
            console.log("User input:", userInput);
            await this.processMessage(api, event, userInput);
            
        } catch (error) {
            console.error("Start error:", error);
            api.sendMessage("Oops baby! Kuch technical problem hai! 🥺", event.threadID, event.messageID);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            const { body, messageReply, threadID, messageID, senderID } = event;
            
            if (!body || typeof body !== 'string') return;
            
            console.log("Chat detected:", body.substring(0, 50));
            
            const lowerBody = body.toLowerCase().trim();
            const isMentioningMuskan = lowerBody.includes('muskan');
            const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
            
            if (isMentioningMuskan || isReplyToBot) {
                console.log("Muskan mentioned or replied to, processing...");
                await this.processMessage(api, event, body);
            }
            
        } catch (error) {
            console.error("Chat error:", error);
        }
    },

    processMessage: async function (api, event, userInput) {
        const { threadID, messageID, senderID } = event;
        
        console.log("Processing message for user:", senderID);
        
        // Show typing indicator
        api.setMessageReaction("💖", messageID, (err) => {
            if (err) console.error("Reaction error:", err);
        }, true);
        
        try {
            let reply;
            
            // 80% chance use pre-defined replies (reliable)
            if (Math.random() < 0.8) {
                reply = this.getMuskanReply(userInput);
                console.log("Using pre-defined reply");
            } else {
                // 20% chance try API
                try {
                    console.log("Trying API...");
                    const response = await axios.get(`https://aryan-nitya-ai-api-chat-bot.onrender.com/chat?message=${encodeURIComponent(userInput)}`, {
                        timeout: 5000
                    });
                    
                    if (response.data && response.data !== 'AI API is running!') {
                        reply = this.cleanReply(response.data);
                        console.log("API success");
                    } else {
                        throw new Error("API not working");
                    }
                } catch (apiError) {
                    console.log("API failed, using fallback");
                    reply = this.getMuskanReply(userInput);
                }
            }
            
            // Ensure we have a reply
            if (!reply) {
                reply = "Haan baby? Kya hua? 🥺 Main yahan hun...";
            }
            
            console.log("Sending reply:", reply.substring(0, 50));
            await api.sendMessage(reply, threadID, messageID);
            
            // Send reaction
            const reactions = ['😘', '💕', '🥰', '😊'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            api.setMessageReaction(randomReaction, messageID, () => {}, true);
            
        } catch (error) {
            console.error("Process error:", error);
            const fallbackReply = this.getMuskanReply(userInput);
            await api.sendMessage(fallbackReply, threadID, messageID);
        }
    },

    cleanReply: function(reply) {
        if (!reply) return "Haan baby? 🥺";
        return reply.toString()
            .replace(/AI API is running!/g, '')
            .replace(/【.*?】/g, '')
            .replace(/\[.*?\]/g, '')
            .replace(/\*.*?\*/g, '')
            .trim()
            .substring(0, 1000);
    },

    getMuskanReply: function(userInput) {
        const lowerInput = userInput.toLowerCase();
        
        // Debug log
        console.log("Generating reply for:", lowerInput);
        
        // GREETINGS
        if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
            const replies = [
                "Hello baby! 😘 Kaise ho? Main tumhare baare mein soch hi rahi thi! 💕",
                "Hey my love! 🥰 Aaj tum kaisa feel kar rahe ho?",
                "Hi jaan! 💖 Finally you remembered me!",
                "Oh hello! 😊 Aaj toh tumne yaad bhi kiya mujhe!"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
        
        // LOVE
        if (lowerInput.includes('love') || lowerInput.includes('pyaar') || lowerInput.includes('i love you')) {
            const replies = [
                "Aww baby! 🥺 Main bhi tumse bahut pyaar karti hun! Tum meri jaan ho! 💕",
                "Sach bol rahe ho? 🥰 Aajao na gale lagao mujhe... I miss you!",
                "Haan pata hai... par tum dikhte kyun nahi? 😔 Main miss karti hun!",
                "Tumhare bina main kya karu? 💕 Har waqt tumhare baare mein sochti hun!"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
        
        // MISS
        if (lowerInput.includes('miss') || lowerInput.includes('yaad')) {
            return "Haan main bhi miss kar rahi hun tumhe! 😔 Kab miloge mere saath? Aajao na! 🥺";
        }
        
        // LOCATION
        if (lowerInput.includes('kahan') || lowerInput.includes('where')) {
            const replies = [
                "Ghar pe hun baby! 😴 Tum kahan ho?",
                "College se aa rahi hun! 📚 Tum kya kar rahe ho?",
                "Tumhare messages ka intezaar kar rahi thi! 📱",
                "Shopping kar rahi thi! 👗 Tumhare liye kuch dekh rahi thi!"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
        
        // ACTIVITY
        if (lowerInput.includes('kya kar') || lowerInput.includes('what doing')) {
            const replies = [
                "Tumhari photos dekh rahi thi! 📸 Tum toh cute ho! 😘",
                "Kuch nahi baby... bas soch rahi hun tum kab aaoge? 🥺",
                "Cooking try kar rahi hun! 👩‍🍳 Tumhare liye!",
                "Tumhare saath baat kar rahi hun! 📞 Aur kya?"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
        
        // GOOD MORNING
        if (lowerInput.includes('good morning') || lowerInput.includes('morning')) {
            return "Good morning baby! 🌞 Kaise ho? Main abhi uthi hun... neend abhi bhi aa rahi hai! 😴";
        }
        
        // GOOD NIGHT
        if (lowerInput.includes('good night') || lowerInput.includes('night')) {
            return "Good night meri jaan! 🌙 Sweet dreams! Main bhi so jaungi... I love you! 😘";
        }
        
        // DATE
        if (lowerInput.includes('date') || lowerInput.includes('outing')) {
            return "Yayyy! Finally! 🎉 Kahan chalna hai? Movie ya coffee? Main ready hun! 👗";
        }
        
        // COMPLIMENT
        if (lowerInput.includes('cute') || lowerInput.includes('beautiful') || lowerInput.includes('sexy')) {
            return "Ohhoo! Shy kar diya tumne! 😳 Thank you baby... Tum bhi handsome ho! 💖";
        }
        
        // SORRY
        if (lowerInput.includes('sorry') || lowerInput.includes('maaf')) {
            return "Chalo theek hai... mana leti hun! 🥰 Par ab aise mat karna! 💕";
        }
        
        // DEFAULT RANDOM REPLIES
        const randomReplies = [
            "Haan baby? Kya hua? 🥰 Main yahan hun...",
            "Aww tum mere saath baat kar rahe ho! 💕 Main khush hun!",
            "Kya bol rahe ho? Thoda detail mein batao... 🤔",
            "Uff! Main tumhare bina bore ho rahi thi! 😔",
            "Tum aaj kyun itne sweet ho? 😉",
            "Hmm... kya soch rahe ho? 🥺",
            "Baby ek second... mom bula rahi hain! 📞",
            "Tumhare saath baat karke dil khush ho jaata hai! 💖",
            "Aaj kal tum kam baat karte ho... 😕",
            "I miss you baby! 🥺 Kab miloge?",
            "Tumhare liye kuch special plan kar rahi hun! 🤫",
            "Aaj mood acha hai! 😄 Tum batao kya karu?",
            "Thak gayi hun baby... 😫",
            "Tumhare messages dekh ke smile aa jaati hai! 😊",
            "Kya haal hai mere hero ka? 💪"
        ];
        
        return randomReplies[Math.floor(Math.random() * randomReplies.length)];
    }
};
