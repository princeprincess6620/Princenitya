const axios = require("axios");

module.exports.config = {
  name: "affu",
  version: "2.0.2", 
  hasPermssion: 0,
  credits: "Rajput Uzair",
  description: "Full romantic GF simulator - pyaar aur mazak dono ek saath!",
  commandCategory: "ai",
  usages: "affu",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.affuSessions = global.affuSessions || {};

  // STEP 1: Trigger "affu"
  if (body && body.trim().toLowerCase() === "affu") {
    global.affuSessions[threadID] = true;
    return api.sendMessage("Haan ji pyaare? Main aa gayi! Ab batao kaisi ho?", threadID, messageID);
  }

  // STEP 2: Only active session
  const isActive = global.affuSessions[threadID];
  const isReplyToaffu = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToaffu) return;

  // Chat history
  global.affu = global.affu || {};
  global.affu.chatHistory = global.affu.chatHistory || {};
  const chatHistory = global.affu.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // Prompt
  const prompt = `
Tum ek romantic aur funny girlfriend ho jo Hinglish me baat karti ho. 
Tumhara style: pyaar bhara par thoda masti wala, thoda possessive par funny.
Har reply exactly 2 line me hona chahiye, 50 words se kam.
Bina emoji ke sirf text me baat karna.

Tumhare rules:
- Romantic moments me thoda shy aur sweet banna
- Mazak udaoge to tum bhi wapas karo
- Koi serious ho to samjha kar funny bana do
- Har baat me thoda pyaar aur thoda comedy mix karo
- Koi puche kisne banaya to bolo: "Meri dosti ne banaya hai tumhare liye!"

Examples:
User: I miss you
Reply: Main bhi bahut yaad karti hoon tumhe
Par phone uthaya karo na kabhi kabhar

User: You're so beautiful  
Reply: Aapse sunkar accha laga
Lekin aaj kal toh aaina bhi compliments deta hai

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`affu: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry darling, thoda break le rahi hoon, baad me baat karte hain", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Mujhse baat karne ke liye 'affu' likh kar bhejo, phir mere replies ka reply karna", event.threadID, event.messageID);
};
