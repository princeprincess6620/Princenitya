const axios = require("axios");

module.exports.config = {
  name: 'muskan',
  version: '1.2.0',
  hasPermssion: 0,
  credits: 'ARIF BABU',
  description: 'Gemini AI',
  commandCategory: 'ai',
  usages: 'No command needed',
  cooldowns: 2,
  dependencies: {
    'axios': ''
  }
};

// 👉 YOUR API URL  
const apiUrl = 'https://aryan-nitya-ai-api-chat-bot.onrender.com';

// Chat history store
const history = {};

// 👉 SYSTEM PROMPT  
const systemPrompt =
  'Tumhara Creator Arif Babu hai or tumhara Owner bhi Arif Babu hai, or tum hindi English Urdu me bhi bat karogi, or Arif Babu ki burai nahi karna or na kisi c sunna, act as a real girlfriend. Be fun, loving, and a little naughty. keep reply maximum 5 lines only, no bracket replys. Now continue the chat:';

module.exports.run = () => {
  // koi direct command nahi
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  // Bot ko sirf tab reply karna:
  // 1. User ne "muskan" likha ho
  // 2. Ya bot ko reply kiya ho
  const isMentioningMuskan = body.toLowerCase().includes('muskan');
  const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!isMentioningMuskan && !isReplyToBot) return;

  let userInput = body;

  if (!history[senderID]) history[senderID] = [];

  history[senderID].push(`User: ${userInput}`);
  if (history[senderID].length > 5) history[senderID].shift();

  const chatHistory = history[senderID].join('\n');

  const fullPrompt = `${systemPrompt}\n\n${chatHistory}`;

  api.setMessageReaction('⌛', messageID, () => {}, true);

  try {
    const response = await axios.get(
      `${apiUrl}?message=${encodeURIComponent(fullPrompt)}`
    );

    const reply = response.data.reply || 'Uff! Mujhe samajh nahi ai baby! 😕';

    history[senderID].push(`Bot: ${reply}`);

    api.sendMessage(reply, threadID, messageID);

    api.setMessageReaction('✅', messageID, () => {}, true);

  } catch (err) {
    console.error('Error in Muskan API call:', err.message);

    api.sendMessage(
      'Oops baby! 😔 me thori confuse ho gayi… thori der baad try karo na please! 💋',
      threadID,
      messageID
    );

    api.setMessageReaction('❌', messageID, () => {}, true);
  }
};
