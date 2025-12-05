module.exports.config = {
  name: "uid",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "M.R-LEGEND-ARYAN",
  description: "Generate stylish Facebook info card with circular DP and frame",
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

  const dpURL = `https://graph.facebook.com/${uid}/picture?height=600&width=600&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avatarPath = __dirname + `/cache/avatar_${uid}.png`;
  const framePath = __dirname + `/cache/frame.png`; //<<--- FRAME FILE REQUIRED

  // Download DP
  await new Promise(resolve =>
    request(dpURL)
      .pipe(fs.createWriteStream(avatarPath))
      .on("close", resolve)
  );

  const avatar = await loadImage(avatarPath);
  const frame = await loadImage(framePath);

  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 600, 600);

  // Draw circular DP
  ctx.save();
  ctx.beginPath();
  ctx.arc(300, 300, 270, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 0, 0, 600, 600);
  ctx.restore();

  // Draw frame on top
  ctx.drawImage(frame, 0, 0, 600, 600);

  // Save final
  const finalPath = __dirname + `/cache/finalframe_${uid}.png`;
  fs.writeFileSync(finalPath, canvas.toBuffer());

  const moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Dhaka");

  const date = moment().format("DD/MM/YYYY");
  const time = moment().format("hh:mm:ss A");
  const day = moment().format("dddd");

  let msg =
`━━━━━━━━━━━━━━━━━━
🎨🍒𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓😘𝐎𝐅-𝐅𝐀𝐓𝐇𝐄𝐑🍒
━━━━━━━━━━━━━━━━━━
📅 Date: ${date}
🕒 Time: ${time}
📆 Day: ${day}

👤 Name: ${name}
🆔 UID: ${uid}
━━━━━━━━━━━━━━━━━━`;

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
