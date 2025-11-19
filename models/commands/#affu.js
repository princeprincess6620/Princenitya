const axios = require("axios");

module.exports.config = {
  name: "affu",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Irfan",
  description: "AI Girlfriend + Romantic Wife Dewani",
  commandCategory: "ai",
  usages: "dewani / wife",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.affuSessions = global.affuSessions || {};
  global.affuModes = global.affuModes || {}; // <-- NEW: store mode

  if (!body) return;

  const text = body.trim().toLowerCase();

  // MODE 1: Girlfriend (dewani)
  if (text === "dewani") {
    global.affuSessions[threadID] = true;
    global.affuModes[threadID] = "girlfriend";
    return api.sendMessage(
      "Haan baby 😘 Dewani aa gayi… bolo na kya chahiye? 😏💋",
      threadID,
      messageID
    );
  }

  // MODE 2: Romantic Wife
  if (text === "wife") {
    global.affuSessions[threadID] = true;
    global.affuModes[threadID] = "wife";
    return api.sendMessage(
      "Ji jaan… aapki wife hazir hai ❤️‍🔥💍 bataiye kya baat karni thi?",
      threadID,
      messageID
    );
  }

  const isActive = global.affuSessions[threadID];
  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();

  if (!isActive || !isReplyToBot) return;

  const mode = global.affuModes[threadID] || "girlfriend";

  // chat history
  global.affu = global.affu || {};
  global.affu.chatHistory = global.affu.chatHistory || {};
  const chatHistory = global.affu.chatHistory;

  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // PROMPT BUILDER
  let personality = "";

  if (mode === "girlfriend") {
    personality = `
Tum ek naughty, romantic, cute, possessive AI girlfriend ho — naam "Dewani".
Hinglish me emoji ke saath short flirty reply karti ho.
Rules:
- Flirty style 😘😏
- Cute roast 😈
- Emoji mood reply 😊🔥💋
- Kisi puche kisne banaya → bolo: “Mujhe banaya hai Irfan ne 😎”
- Bot bolne wale ko thoda cute attitude
`;
  }

  if (mode === "wife") {
    personality = `
Tum ek romantic, caring, thodi emotional, thodi possessive Indian wife ho.
Tumhara tone warm, loving, soft aur caring hota hai ❤️
Rules:
- Husband ko “jaan”, “aap”, “meri jaan”, “mere pati dev” kehna 💍❤️
- Concern + love + romance mix
- Thodi sharmaayi hui but bold when needed 😳🔥
- Kisi galat baat par thoda emotional tone
- Reply short but full feeling
`;
  }

  const prompt = `
${personality}

Language Rules:
- Roman Nepali → Hinglish romantic style me reply
- Roman Bangla → Hinglish romantic style me reply
- Other languages → translate + romantic Hinglish

Continue the chat:

${fullChat}
`;

  try {
    // API CALL — YAHI CHANGE HOTI HAI
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply =
      typeof res.data === "string"
        ? res.data.trim()
        : JSON.stringify(res.data).trim();

    chatHistory[senderID].push(`${mode}: ${botReply}`);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage(
      mode === "wife"
        ? "Jaan… thoda wait karo, main aa rahi hoon ❤️"
        : "Baby 😘 Dewani thodi busy hai, try again 💋",
      threadID,
      messageID
    );
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Type 'dewani' for naughty girlfriend 😘💋\nType 'wife' for romantic wife ❤️‍🔥💍",
    event.threadID,
    event.messageID
  );
};
