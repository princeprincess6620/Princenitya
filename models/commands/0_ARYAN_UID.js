module.exports.config = {
  name: "uid",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "OWNER PRINCE",
  description: "UID + Profile link (mention bug fixed)",
  commandCategory: "utility",
  usages: "uid / uid @tag / reply + uid",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  try {
    let targetID;
    let name = "User";

    // ✅ MENTION FIX
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      name = event.mentions[targetID].replace("@", "");

    // ✅ REPLY
    } else if (event.messageReply) {
      targetID = event.messageReply.senderID;

    // ✅ SELF
    } else {
      targetID = event.senderID;
      name = "Aap";
    }

    const profileLink = `https://www.facebook.com/${targetID}`;

    return api.sendMessage(
      `🆔 USER INFO\n━━━━━━━━━━━━━━━\n👤 Name: ${name}\n🔢 UID: ${targetID}\n🔗 Profile: ${profileLink}`,
      event.threadID,
      event.messageID
    );

  } catch (e) {
    return api.sendMessage(
      "❌ Mention se UID nahi mil rahi — reply karke try karo",
      event.threadID,
      event.messageID
    );
  }
};
