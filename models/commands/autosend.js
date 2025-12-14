const schedule = require("node-schedule");
const moment = require("moment-timezone");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "autosend",
  version: "6.0.0",
  hasPermssion: 0,
  credits: "𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍 (fixed by ChatGPT)",
  description: "Auto message every 1 hour with time & photo",
  commandCategory: "system",
  usages: "automatic",
  cooldowns: 0
};

/* ================= TIME FUNCTION ================= */

const getTimeInfo = () => {
  const now = moment().tz("Asia/Kolkata");
  const hour = Number(now.format("HH"));

  let emoji = "🌙";
  if (hour >= 5 && hour < 12) emoji = "🌅";
  else if (hour >= 12 && hour < 17) emoji = "☀️";
  else if (hour >= 17 && hour < 21) emoji = "🌇";

  return {
    time: now.format("hh:mm A"),
    day: now.format("dddd"),
    month: now.format("MMMM"),
    date: now.format("DD"),
    emoji
  };
};

const createBracket = (info) => `
╔═══════════════════════════════════════════╗
║         🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀          ║
╠═══════════════════════════════════════════╣
║    ${info.emoji} Time: ${info.time} ${info.emoji}
║    📅 Date: ${info.date} ${info.month} ${info.day}
║    ⏰ Interval: 1 Hour
╚═══════════════════════════════════════════╝
`;

const photoFolder = path.join(__dirname, "..", "autosend");

const getRandomPhoto = () => {
  if (!fs.existsSync(photoFolder)) {
    fs.mkdirSync(photoFolder, { recursive: true });
    return null;
  }

  const files = fs.readdirSync(photoFolder)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

  if (!files.length) return null;

  const file = files[Math.floor(Math.random() * files.length)];
  return fs.createReadStream(path.join(photoFolder, file));
};

/* ================= ON LOAD ================= */

let jobStarted = false;

module.exports.onLoad = async ({ api }) => {
  if (jobStarted) return;
  jobStarted = true;

  console.log(chalk.green("✅ AutoSend (1 Hour) Loaded"));

  const sendAutoMessage = async () => {
    const info = getTimeInfo();
    const message = createBracket(info);
    const threadIDs = global.data?.allThreadID || [];

    for (const tid of threadIDs) {
      try {
        const photo = getRandomPhoto();
        await api.sendMessage(
          photo ? { body: message, attachment: photo } : { body: message },
          tid
        );
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.log("❌ Failed:", tid);
      }
    }
  };

  // ⏰ EVERY 1 HOUR (minute 0)
  schedule.scheduleJob("0 * * * *", sendAutoMessage);

  // 🚀 First test after 10 seconds
  setTimeout(sendAutoMessage, 10000);
};

/* ================= MANUAL TEST ================= */

module.exports.run = async ({ api, event }) => {
  const info = getTimeInfo();
  const message = createBracket(info);
  const photo = getRandomPhoto();

  await api.sendMessage(
    photo ? { body: message, attachment: photo } : { body: message },
    event.threadID
  );
};
