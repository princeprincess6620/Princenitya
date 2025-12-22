
const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");

module.exports.config = {
  name: "welcome",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "LEGEND",
  description: "Welcome new member with profile card",
  commandCategory: "event",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  try {
    const threadID = event.threadID;
    const userID = event.logMessageData.addedParticipants[0].userFbId;

    const userInfo = await api.getUserInfo(userID);
    const userName = userInfo[userID].name;

    const canvas = Canvas.createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0b0f1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glow border
    ctx.strokeStyle = "#00f6ff";
    ctx.lineWidth = 6;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00f6ff";
    ctx.strokeRect(20, 20, 760, 410);

    // Facebook text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1877f2";
    ctx.font = "bold 40px Arial";
    ctx.fillText("facebook", 310, 70);

    // Avatar
    const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512`;
    const avatar = await Canvas.loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(400, 220, 80, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 320, 140, 160, 160);
    ctx.restore();

    // Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(userName, 400, 340);

    const imgPath = path.join(__dirname, "welcome.png");
    fs.writeFileSync(imgPath, canvas.toBuffer());

    api.sendMessage(
      {
        body: `👋 Welcome ${userName}`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath)
    );

  } catch (e) {
    console.log("WELCOME ERROR:", e);
  }
};

module.exports.run = () => {};
