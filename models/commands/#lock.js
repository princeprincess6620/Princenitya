module.exports.config = {
  name: "lock",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "PRINCE",
  description: "Bot admin nickname lock on/off",
  commandCategory: "admin",
  usages: "lock on / lock off",
  cooldowns: 2
};

// 🔐 BOT ADMIN UID
const BOT_ADMIN_UID = "61587018862476";

// 📝 Locked nickname
const LOCKED_NICKNAME = "👑 BOT ADMIN 👑";

// 🔄 Memory (runtime)
let lockStatus = false;

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  // ❌ Sirf bot admin use kar sakta
  if (String(senderID) !== String(BOT_ADMIN_UID)) {
    return api.sendMessage(
      "❌ Sirf Bot Admin ye command use kar sakta hai!",
      threadID
    );
  }

  if (!args[0]) {
    return api.sendMessage(
      "ℹ Use karo:\nlock on\nlock off",
      threadID
    );
  }

  // 🔓 LOCK ON
  if (args[0] === "on") {
    lockStatus = true;

    await api.changeNickname(
      LOCKED_NICKNAME,
      threadID,
      BOT_ADMIN_UID
    );

    return api.sendMessage(
      "🔒 Nickname lock ON ho gaya!",
      threadID
    );
  }

  // 🔓 LOCK OFF
  if (args[0] === "off") {
    lockStatus = false;

    return api.sendMessage(
      "🔓 Nickname lock OFF ho gaya!",
      threadID
    );
  }

  return api.sendMessage(
    "❌ Galat option!\nUse: lock on / lock off",
    threadID
  );
};

// 🔔 EVENT LISTENER (same file me)
module.exports.handleEvent = async function ({ api, event }) {
  if (!lockStatus) return;
  if (event.logMessageType !== "log:user-nickname") return;

  const targetUID =
    event.logMessageData?.participant_id;

  if (String(targetUID) !== String(BOT_ADMIN_UID)) return;

  const threadInfo = await api.getThreadInfo(event.threadID);
  const currentNick = threadInfo.nicknames[targetUID] || "";

  if (currentNick !== LOCKED_NICKNAME) {
    await api.changeNickname(
      LOCKED_NICKNAME,
      event.threadID,
      BOT_ADMIN_UID
    );

    api.sendMessage(
      "⛔ Bot Admin ka nickname change karna mana hai!",
      event.threadID
    );
  }
};
