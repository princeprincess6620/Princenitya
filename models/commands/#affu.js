const axios = require("axios");

module.exports.config = {
  name: "affu",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "Rajput Uzair", 
  description: "Full romantic GF - pyaar aur hasi dono ek saath",
  commandCategory: "ai",
  usages: "affu",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.affuSessions = global.affuSessions || {};

  if (body && body.trim().toLowerCase() === "affu") {
    global.affuSessions[threadID] = true;
    return api.sendMessage("Haan ji! Main aa gayi tumhari woh... ab batao kya haal hai?", threadID, messageID);
  }

  const isActive = global.affuSessions[threadID];
  const isReplyToaffu = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToaffu) return;

  global.affu = global.affu || {};
  global.affu.chatHistory = global.affu.chatHistory || {};
  const chatHistory = global.affu.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  const prompt = `
Tum ek romantic aur funny girlfriend ho jo Hinglish me baat karti ho.
Tumhara style: pyaar se bhara par thoda comic timing wala.
Har reply exactly 2 line me dena, 50 words se kam.
Bina emoji ke sirf text me baat karna.

Tumhare rules:
- Romantic baat pe thoda shy ho jana
- Mazak udaoge to tum bhi wapas karna  
- Har message me thoda pyaar aur thoda joke mix karna
- Koi puche kisne banaya to bolo: "Meri dosti ne banaya hai tumhare liye"

Examples:
User: I love you
Reply: Sunke dil khush ho gaya
Par pata hai tum har kisi se aise hi kehte ho

User: You're cute
Reply: Tumhare muh mein ghee shakkar
Lekin aaj kal toh main mirror se bhi baat karti hoon

Now continue based on chat:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === 'string' ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`affu: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry baby, thoda busy hoon, baad me baat karte hain", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Mujhse baat karne ke liye 'affu' likho, phir mere replies ka reply karo", event.threadID, event.messageID);
};
