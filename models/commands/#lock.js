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

// 🔐 BOT ADMIN UID - CHANGE THIS TO YOUR ACTUAL UID
const BOT_ADMIN_UID = "61587018862476"; // Replace with your actual Facebook UID

// 📝 LOCKED NICKNAME
const LOCKED_NICKNAME = "👑 BOT ADMIN 👑";

// Ensure lockData.json exists
function ensureLockFile() {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ lock: false }, null, 2));
  }
}

// ---------- COMMAND ----------
module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;

  // Ensure lock file exists
  ensureLockFile();

  // ❌ Sirf bot admin
  if (String(senderID) !== String(BOT_ADMIN_UID)) {
    return api.sendMessage(
      "❌ Sirf Bot Admin ye command use kar sakta hai!",
      threadID,
      messageID
    );
  }

  if (!args[0]) {
    return api.sendMessage(
      "Use karo:\n.lock on\n.lock off",
      threadID,
      messageID
    );
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch (error) {
    console.error("Error reading lock data:", error);
    data = { lock: false };
  }

  const action = args[0].toLowerCase();

  // 🔒 LOCK ON
  if (action === "on") {
    data.lock = true;
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      
      // nickname set
      await api.changeNickname(
        LOCKED_NICKNAME,
        threadID,
        BOT_ADMIN_UID
      );

      return api.sendMessage(
        "🔒 Nickname lock ON ho gaya! Bot admin ka nickname '" + LOCKED_NICKNAME + "' set kar diya gaya.",
        threadID,
        messageID
      );
    } catch (error) {
      console.error("Error turning lock ON:", error);
      return api.sendMessage(
        "❌ Error: Nickname set nahi kar paya. Check console for details.",
        threadID,
        messageID
      );
    }
  }

  // 🔓 LOCK OFF
  if (action === "off") {
    data.lock = false;
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 2));

      return api.sendMessage(
        "🔓 Nickname lock OFF ho gaya! Ab nickname change kiya ja sakta hai.",
        threadID,
        messageID
      );
    } catch (error) {
      console.error("Error turning lock OFF:", error);
      return api.sendMessage(
        "❌ Error: Lock OFF nahi kar paya.",
        threadID,
        messageID
      );
    }
  }

  api.sendMessage(
    "❌ Galat option!\nUse: .lock on / .lock off",
    threadID,
    messageID
  );
};

// ---------- EVENT (AUTO NICKNAME PROTECT) ----------
module.exports.handleEvent = async function ({ api, event }) {
  // Ensure lock file exists
  ensureLockFile();

  try {
    const data = JSON.parse(fs.readFileSync(path));
    if (!data.lock) return;

    // Check if this is a nickname change event
    if (event.logMessageType === "log:user-nickname") {
      const targetUID = event.logMessageData?.participant_id;
      
      // Check if the nickname change is for bot admin
      if (targetUID && String(targetUID) === String(BOT_ADMIN_UID)) {
        console.log(`Detected nickname change attempt for bot admin (UID: ${targetUID})`);
        
        // Try to revert the nickname
        try {
          await api.changeNickname(
            LOCKED_NICKNAME,
            event.threadID,
            BOT_ADMIN_UID
          );

          // Send warning message
          api.sendMessage(
            "⚠️ Bot Admin ka nickname change karna mana hai! Nickname revert kar diya gaya.",
            event.threadID
          );
        } catch (error) {
          console.error("Error reverting nickname:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error in handleEvent:", error);
  }
};
