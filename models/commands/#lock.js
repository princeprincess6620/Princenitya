const fs = require("fs");

module.exports.config = {
  name: "lock",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "MERA JANU",
  description: "Simple bot admin nickname lock",
  commandCategory: "admin",
  usages: ".lock on / .lock off",
  cooldowns: 0
};

// 🔴 APNA REAL UID DALO
const BOT_ADMIN_UID = "61587018862476";

// 🔒 FIXED NICKNAME
const LOCK_NAME = "👑 BOT ADMIN 👑";

// Memory lock (simple)
let LOCK = false;

// ---------- COMMAND ----------
module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  // ❌ Sirf bot admin
  if (senderID !== BOT_ADMIN_UID)
    return api.sendMessage("❌ Sirf Bot Admin use kar sakta hai", threadID);

  if (!args[0])
    return api.sendMessage(".lock on / .lock off", threadID);

  if (args[0] === "on") {
    LOCK = true;
    api.changeNickname(LOCK_NAME, threadID, BOT_ADMIN_UID);
    return api.sendMessage("🔒 Nickname Lock ON", threadID);
  }

  if (args[0] === "off") {
    LOCK = false;
    return api.sendMessage("🔓 Nickname Lock OFF", threadID);
  }
};

// ---------- AUTO PROTECT ----------
module.exports.handleEvent = async function ({ api, event }) {
  if (!LOCK) return;

  if (event.logMessageType === "log:user-nickname") {
    if (event.logMessageData?.participant_id === BOT_ADMIN_UID) {
      setTimeout(() => {
        api.changeNickname(
          LOCK_NAME,
          event.threadID,
          BOT_ADMIN_UID
        );
      }, 1500);
    }
  }
};
