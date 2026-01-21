module.exports.config = {
  name: "cp",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "M.R ARSH",
  description: "Long message (copy spam) se group clean",
  commandCategory: "group",
  usages: "auto",
  cooldowns: 0
};

// 🔐 OWNER UIDs (2 owners yahan add)
const OWNER_IDS = [
  "61587018862476", // Owner 1
  "100000000000001"  // Owner 2
];

// 📏 Long message limit (characters)
const LONG_MSG_LIMIT = 300;

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body) return;

  // long / copy spam check (emoji + text)
  if (body.length < LONG_MSG_LIMIT) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();

    // 🤖 bot admin hona zaroori
    if (!threadInfo.adminIDs.some(e => e.id == botID)) return;

    // 🔐 sender admin ya owner hona chahiye
    const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);
    const isOwner = OWNER_IDS.includes(senderID);
    if (!isAdmin && !isOwner) return;

    const warn = await api.sendMessage(
      "🧹 CP / long message detect hua, group clean ho raha hai...",
      threadID
    );

    // 🧨 last 100 messages clean
    const history = await api.getThreadHistory(threadID, 100);
    for (const msg of history) {
      if (msg.messageID) {
        await api.unsendMessage(msg.messageID);
        await new Promise(r => setTimeout(r, 250));
      }
    }

    if (warn.messageID) await api.unsendMessage(warn.messageID);

  } catch (err) {
    console.error(err);
  }
};
