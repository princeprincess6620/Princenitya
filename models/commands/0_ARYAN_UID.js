module.exports.config = {
  name: "uid",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "M.R-LEGEND-ARYAN",
  description: "UID info with circular DP + stylish glowing name",
  commandCategory: "Tools",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {

  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const { createCanvas, loadImage } = require("canvas");

  let uid, name;

  if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
    name = event.mentions[uid].replace("@", "");
  } else {
    uid = event.senderID;
    name = "Facebook User";
  }

  const dpURL = `https://graph.facebook.com/${uid}/picture?height=700&width=700&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avatarPath = __dirname + `/cache/avatar_${uid}.png`;

  await new Promise(resolve =>
    request(dpURL)
      .pipe(fs.createWriteStream(avatarPath))
      .on("close", resolve)
  );

  const avatar = await loadImage(avatarPath);

  const canvas = createCanvas(800, 950);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 800, 950);

  // Round DP
  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 450, 300, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 100, 150, 600, 600);
  ctx.restore();

  // Border frame
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(400, 450, 300, 0, Math.PI * 2);
  ctx.stroke();

  // GRADIENT NAME WITH GLOW
  let gradient = ctx.createLinearGradient(200, 0, 600, 0);
  gradient.addColorStop(0, "#ff4dd2"); // Pink
  gradient.addColorStop(1, "#00b7ff"); // Blue

  ctx.font = "bold 55px Arial";
  ctx.textAlign = "center";
  ctx.lineWidth = 8;

  // Outline
  ctx.strokeStyle = "black";
  ctx.strokeText(name, 400, 120);

  // Glow effect
  ctx.shadowColor = "rgba(0, 153, 255, 0.8)";
  ctx.shadowBlur = 25;

  // Fill text (gradient)
  ctx.fillStyle = gradient;
  ctx.fillText(name, 400, 120);

  // Remove shadow for rest elements
  ctx.shadowBlur = 0;

  const finalPath = __dirname + `/cache/final_uid_${uid}.png`;
  fs.writeFileSync(finalPath, canvas.toBuffer());

  const moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Dhaka");

  let msg = `
🤖 BOT INFO 🎉
━━━━━━━━━━━━━━
📅 Date: ${moment().format("DD/MM/YYYY")}
🕒 Time: ${moment().format("hh:mm:ss A")}
📆 Day: ${moment().format("dddd")}

👤 Name: ${name}
🆔 UID: ${uid}
━━━━━━━━━━━━━━`;

  api.sendMessage(
    {
      body: msg,
      attachment: fs.createReadStream(finalPath)
    },
    event.threadID,
    () => {
      fs.unlinkSync(avatarPath);
      fs.unlinkSync(finalPath);
    },
    event.messageID
  );
};
