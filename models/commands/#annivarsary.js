const fs = require("fs");
module.exports.config = {
  name: "annivarsary",
    version: "1.1.1",
  hasPermssion: 0,
  credits: "LEGEND-ARYAN ", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("annivarsary") ||
     react.includes("ANNIVARSARY") || react.includes("Anniversary") || react.includes("🎂") ||
react.includes("🍰") ||
react.includes("🧁")) {
    var msg = {
        body: `🦋🥀𝗛à𝖕𝖕𝘺🥀🦋🍁•Äทᶯῖṿ𝖾𝖗ᔆã𝖗ʸ•🍁   `,
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🎂", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
