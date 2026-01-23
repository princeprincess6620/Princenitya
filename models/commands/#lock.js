module.exports.config = {
  name: "lock",
  eventType: ["log:user-nickname"],
  version: "1.0.0",
  credits: "PRINCE",
  description: "Only bot admin nickname protection"
};

// 🔐 BOT ADMIN UID (apni real UID daalo)
const BOT_ADMIN_UID = "61587018862476";

// 📝 Lock nickname (jo hamesha rahega)
const LOCKED_NICKNAME = "👑 BOT ADMIN 👑";

module.exports.run = async function({ api, event }) {
  const { threadID, logMessageType, logMessageData } = event;

  if (logMessageType !== "log:user-nickname") return;

  const targetUID = logMessageData.participant_id;
  const newNickname = logMessageData.nickname || "";

  // ✅ Sirf bot admin ka nickname lock
  if (targetUID !== BOT_ADMIN_UID) return;

  // 🔁 Nickname wapas set karo
  if (newNickname !== LOCKED_NICKNAME) {
    try {
      await api.changeNickname(
        LOCKED_NICKNAME,
        threadID,
        BOT_ADMIN_UID
      );

      api.sendMessage(
        "⛔ Bot Admin ka nickname change karna mana hai!",
        threadID
      );
    } catch (e) {
      console.log("BotAdminNickLock Error:", e);
    }
  }
};
