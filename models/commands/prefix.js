/**
 * 🔱 ULTRA PREMIUM PREFIX DETECTOR 🔱
 * ⚡ Fast • Clean • Aesthetic • Mirai Optimized
 */

module.exports.config = {
  name: "prefix",
  version: "5.5.0",
  hasPermssion: 0,
  credits: "👑 Priyansh Rajput",
  description: "Show bot prefix when someone asks",
  commandCategory: "System",
  usages: "",
  cooldowns: 3,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;

  // 🔐 CREDIT PROTECTION (unicode)
  const realCredit = "👑 Priyansh Rajput";
  if (this.config.credits !== realCredit) {
    return api.sendMessage(
      "❌ Credit Modify Mat Karo!\n✔ Original Credit: 👑 Priyansh Rajput",
      threadID,
      messageID
    );
  }

  // 🌟 Keywords that trigger prefix response
  const triggers = [
    "prefix", "mprefix", "mpre", "bot prefix", "perfix", "prefx", "preefix",
    "what prefix", "bot ka prefix", "bot not working", "dau lenh",
    "*", "/", ".", "?"
  ];

  if (!triggers.includes(body.toLowerCase())) return;

  const threadData = await Threads.getData(threadID);
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // 🌈 ULTRA UNIQUE MESSAGE OUTPUT
  const msg =
`╔══ 🔱 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 🔱 ══╗  
   ➥  ${ ➥. }
╚════════════════════╝

🌸 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐓𝐨 𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓 🌸

👑 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑:  𝐀𝐑𝐘𝐀𝐍  
📌 𝐎𝐰𝐧𝐞𝐫 𝐅𝐁 𝐋𝐢𝐧𝐤:
https://www.facebook.com/profile.php?id=100092750349098

💬 𝐊𝐨𝐢 𝐏𝐫𝐨𝐛𝐥𝐞𝐦? → Boss Aryan Ko Msg Kare 😊
`;

  api.sendMessage(msg, threadID, messageID);
};

module.exports.run = ({ event, api }) =>
  api.sendMessage("⚠ Prefix command is for event only.", event.threadID);
