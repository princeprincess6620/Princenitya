module.exports.config = {
  name: "uid",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "ARYAN-LEGEND | Fixed by MERA JANU",
  description: "Show Facebook UID + Name (Stable Version)",
  commandCategory: "Tools",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {

  const moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Dhaka");

  let uid;
  if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = event.senderID;
  }

  // ✅ User info fetch (safe)
  let name = "Unknown User";
  try {
    const info = await api.getUserInfo(uid);
    if (info && info[uid] && info[uid].name) {
      name = info[uid].name;
    }
  } catch (e) {}

  const date = moment().format("DD/MM/YYYY");
  const time = moment().format("hh:mm:ss A");
  const day = moment().format("dddd");

  const msg =
`━━━━━━━━━━━━━━━━━━
🍒 ARYAN BOT 🍒
━━━━━━━━━━━━━━━━━━
👤 Name : ${name}
🆔 UID  : ${uid}

📅 Date : ${date}
🕒 Time : ${time}
📆 Day  : ${day}
━━━━━━━━━━━━━━━━━━`;

  // ✅ Direct DP URL (no token, no download)
  const dpURL = `https://graph.facebook.com/${uid}/picture?height=720&width=720`;

  api.sendMessage(
    {
      body: msg,
      attachment: await global.utils.getStreamFromURL(dpURL)
    },
    event.threadID,
    event.messageID
  );
};
