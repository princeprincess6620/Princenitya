module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show owner profile card",
  commandCategory: "system",
  usages: "",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage(
    `🌐 Owner Facebook Profile\n👉 https://www.facebook.com/profile.php?id=61580003810694`,
    event.threadID,
    event.messageID
  );
};
