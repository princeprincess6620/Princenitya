const axios = require("axios");

module.exports.config = {
  name: "girlfriend",
  version: "4.1.0-fast",
  hasPermssion: 0,
  credits: "Developer",
  description: "FAST Realistic Girlfriend AI",
  commandCategory: "ai",
  usages: "girlfriend on/off | intimate on/off | jealous on/off",
  cooldowns: 1
};

global.gfSessions = {};
global.gfChat = {};
global.gfMode = {};
global.gfMood = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  /* ===== ON / OFF ===== */
  if (msg === "girlfriend on") {
    gfSessions[threadID] = true;
    gfMode[threadID] = "normal";
    gfMood[senderID] = "romantic";
    gfChat[senderID] = [];
    return api.sendMessage("Aa gayi jaan ❤️ reply karo mujhe 😘", threadID, messageID);
  }

  if (msg === "girlfriend off") {
    delete gfSessions[threadID];
    delete gfChat[senderID];
    delete gfMode[threadID];
    delete gfMood[senderID];
    return api.sendMessage("Bye jaan 😔 miss karna ❤️", threadID, messageID);
  }

  /* ===== MODES ===== */
  if (msg === "girlfriend intimate on") {
    gfMode[threadID] = "intimate";
    gfMood[senderID] = "playful";
    return api.sendMessage("Hmm 😏 mood thoda hot ho gaya ❤️‍🔥", threadID, messageID);
  }

  if (msg === "girlfriend intimate off") {
    gfMode[threadID] = "normal";
    return api.sendMessage("Hehe 😊 normal ho gayi ❤️", threadID, messageID);
  }

  if (msg === "girlfriend jealous on") {
    gfMode[threadID] = "jealous";
    gfMood[senderID] = "angry";
    return api.sendMessage("Accha? 😤 ab sirf meri baat samjhe? 💔", threadID, messageID);
  }

  if (msg === "girlfriend jealous off") {
    gfMode[threadID] = "normal";
    gfMood[senderID] = "happy";
    return api.sendMessage("Theek hai 😊 par tum mere ho ❤️", threadID, messageID);
  }

  /* ===== ACTIVE CHECK ===== */
  if (!gfSessions[threadID]) return;

  const isReply = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isReply) return;

  /* ===== MOOD QUICK CHECK ===== */
  if (/love|miss|jaan|baby/.test(msg)) gfMood[senderID] = "romantic";
  else if (/busy|ignore|friend|girl/.test(msg)) gfMood[senderID] = "angry";
  else if (/sad|tension|problem/.test(msg)) gfMood[senderID] = "sad";

  /* ===== MEMORY (SHORT) ===== */
  gfChat[senderID].push(`User: ${body}`);
  if (gfChat[senderID].length > 6) gfChat[senderID].shift();

  const history = gfChat[senderID].join("\n");
  const mode = gfMode[threadID] || "normal";
  const mood = gfMood[senderID] || "happy";

  /* ===== FAST PROMPT ===== */
  const prompt = `
You are Priya, an Indian girlfriend.
Talk in Hinglish, 1-2 lines only, emojis ❤️😏😤🥺

Mode: ${mode}
Mood: ${mood}

Normal = sweet & caring
Intimate = close, seductive but NON-EXPLICIT
Jealous = possessive, emotional, hurt

Rules:
- Natural girlfriend chat
- Ask small questions
- No porn, no explicit sex

Chat:
${history}

Reply as Priya:
`;

  try {
    const res = await axios.get(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
      { timeout: 7000 }
    );

    const reply = (typeof res.data === "string" ? res.data : "").trim();
    gfChat[senderID].push(`Priya: ${reply}`);

    return api.sendMessage(reply || "Sunoo jaan ❤️", threadID, messageID);
  } catch {
    return api.sendMessage("Jaan 😔 thoda slow ho gaya… par main yahin hoon ❤️", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Use:\n• girlfriend on/off\n• girlfriend intimate on/off\n• girlfriend jealous on/off ❤️",
    event.threadID,
    event.messageID
  );
};
