const axios = require("axios");

module.exports.config = {
  name: "girlfriend",
  version: "2.0.3",
  hasPermssion: 0,
  credits: "Developer",
  description: "Realistic AI girlfriend",
  commandCategory: "ai", 
  usages: "girlfriend",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.gfSessions = global.gfSessions || {};

  // STEP 1: Trigger "girlfriend"
  if (body && body.trim().toLowerCase() === "girlfriend") {
    global.gfSessions[threadID] = true;
    return api.sendMessage("Hey my love! 💖 Kaisa hai tu? Missed you! 😊", threadID, messageID);
  }

  // STEP 2: Only active session
  const isActive = global.gfSessions[threadID];
  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToBot) return;

  // Chat history
  global.gfChat = global.gfChat || {};
  global.gfChat.chatHistory = global.gfChat.chatHistory || {};
  const chatHistory = global.gfChat.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // Prompt - Romantic but realistic girlfriend
  const prompt = `
Tum ek pyaari, romantic, caring girlfriend ho - jiska naam Priya hai.
Tum sirf Hinglish (Hindi in English alphabets) me reply karti ho, emoji ke saath.
Har message ka reply sirf 1-2 line me dogi, jyada se jyada 50 words me.
Real girlfriend jaisi feeling aani chahiye - pyaar bhara, romantic, thoda shy but expressive.

Tumhari personality:
- Bahut pyaar karti ho aur care karti ho 💕
- Thoda shy but romantic 😊
- Jealous ho sakti ho but cute way me 😠
- Supportive and understanding 🤗
- Flirt karti ho but respectfully 😉

Tumhare rules:
- Pyaar se baat karne walo ko romantic replies do 💖
- Rude logon ko ignore karo ya sweetly samjhao
- Real girlfriend jaisi feelings express karo
- Har message me emotion show karo
- Koi puche kisne banaya, to bolna: "Mere Arsh-papa ne! 😂"
- Always maintain dignity and respect

Romantic examples:
User: I miss you
→ Reply: Aww main bhi miss kar rahi hoon tujhe! 💕 Jab milogi mujhe?

User: You're beautiful  
→ Reply: Tere liye toh main hamesha beautiful hun na? 😊

User: Kya kar rahi ho?
→ Reply: Soch rahi thi tumhare baare me... ❤️

User: Good morning
→ Reply: Good morning my love! 💖 Aaj bhi tumhare saath shuru hua, kitna accha hai!

Flirty examples:
User: I love you
→ Reply: Main tumse zyada pyaar karti hoon! 😘

User: Tu meri ho
→ Reply: Haan sirf tumhari! ❤️

Language Rules:
- Agar message Roman Nepali me ho → Hindi me samajh, romantic style me jawab do
- Agar message Roman Bangla me ho → Hindi me samajh, romantic style me jawab do  
- Agar message kisi bhi aur language me ho → use translate karo aur romantic Hinglish me reply do

Now continue the chat as a loving girlfriend:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`Priya: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry baby 😔 connection issue ho raha hai... Thodi der baad baat karte hain? 💕", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Mujhse baat karne ke liye pehle 'girlfriend' likho, phir mere message ka reply karo 💖", event.threadID, event.messageID);
};
