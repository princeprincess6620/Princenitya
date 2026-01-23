const fs = require("fs");
const path = __dirname + "/lockData.json";

module.exports.config = {
  name: "lock",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "MERA JANU",
  description: "Bot admin nickname lock on/off",
  commandCategory: "admin",
  usages: ".lock on / .lock off",
  cooldowns: 0
};

// 🔐 BOT ADMIN UID
const BOT_ADMIN_UID = "61587018862476";

// 📝 LOCKED NICKNAME
const LOCKED_NICKNAME = "👑 BOT ADMIN 👑";

// ---------- COMMAND ----------
module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  // ❌ Sirf bot admin
  if (String(senderID) !== String(BOT_ADMIN_UID)) {
    return api.sendMessage(
      "❌ Sirf Bot Admin ye command use kar sakta hai!",
      threadID
    );
  }

  if (!args[0]) {
    return api.sendMessage(
      "Use karo:\n.lock on\n.lock off",
      threadID
    );
  }

  let data = fs.existsSync(path)
    ? JSON.parse(fs.readFileSync(path))
    : { lock: false };

  // 🔒 LOCK ON
  if (args[0] === "on") {
    data.lock = true;
    fs.writeFileSync(path, JSON.stringify(data));

    // nickname set
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
    data.lock = false;
    fs.writeFileSync(path, JSON.stringify(data));

    return api.sendMessage(
      "🔓 Nickname lock OFF ho gaya!",
      threadID
    );
  }

  api.sendMessage(
    "❌ Galat option!\nUse: .lock on / .lock off",
    threadID
  );
};

// ---------- EVENT (AUTO NICKNAME PROTECT) ----------
module.exports.handleEvent = async function ({ api, event }) {
  if (!fs.existsSync(path)) return;

  const data = JSON.parse(fs.readFileSync(path));
  if (!data.lock) return;

  if (event.logMessageType !== "log:user-nickname") return;

  const targetUID = event.logMessageData?.participant_id;
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
