module.exports.config = {
  name: "uid",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "OWNER PRINCE",
  description: "User ki UID + Facebook profile link",
  commandCategory: "utility",
  usages: "uid / uid @tag / reply + uid",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  try {
    let targetID;
    let name = "User";

    // 1️⃣ Mention check
    if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      name = event.mentions[targetID].replace("@", "");

    // 2️⃣ Reply check
    } else if (event.messageReply) {
      targetID = event.messageReply.senderID;

    // 3️⃣ Default (sender)
    } else {
      targetID = event.senderID;
      name = "Aap";
    }

    // Facebook profile link
    const profileLink = `https://www.facebook.com/${targetID}`;

    return api.sendMessage(
      `🆔 USER INFO\n━━━━━━━━━━━━━━━\n👤 Name: ${name}\n🔢 UID: ${targetID}\n🔗 Profile: ${profileLink}`,
      event.threadID,
      event.messageID
    );

  } catch (err) {
    return api.sendMessage(
      "❌ UID / Profile link nikalne me error aa gaya",
      event.threadID,
      event.messageID
    );
  }
};
