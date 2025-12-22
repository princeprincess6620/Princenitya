const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const axios = require("axios");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"]
};

module.exports.run = async function ({ api, event }) {
  try {
    const { threadID } = event;
    const userID = event.logMessageData.addedParticipants[0].userFbId;

    const userInfo = await api.getUserInfo(userID);
    const userName = userInfo[userID].name;

    // Canvas size
    const canvas = Canvas.createCanvas(800, 500);
    const ctx = canvas.getContext("2d");

    // Background (dark glass)
    ctx.fillStyle = "#0b0f1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glow border
    ctx.strokeStyle = "#00f6ff";
    ctx.lineWidth = 8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00f6ff";
    ctx.strokeRect(20, 20, 760, 460);

    // Facebook text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1877f2";
    ctx.font = "bold 42px Arial";
    ctx.fillText("facebook", 300, 70);

    // User DP
    const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512`;
    const avatar = await Canvas.loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(400, 220, 90, 0, Math.PI * 2);
    ctx.closePath();
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00f6ff";
    ctx.clip();
    ctx.drawImage(avatar, 310, 130, 180, 180);
    ctx.restore();

    // Neon circle
    ctx.beginPath();
    ctx.arc(400, 220, 95, 0, Math.PI * 2);
    ctx.strokeStyle = "#00f6ff";
    ctx.lineWidth = 5;
    ctx.stroke();

    // User name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Arial";
    ctx.textAlign = "center";
    ctx.fillText(userName, 400, 360);

    ctx.font = "22px Arial";
    ctx.fillStyle = "#bbbbbb";
    ctx.fillText("Welcome to the group", 400, 400);

    // Save image
    const imgPath = path.join(__dirname, "welcome_card.png");
    fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

    // Send message
    api.sendMessage(
      {
        body: `👋 Welcome ${userName} ✨`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath)
    );

  } catch (err) {
    console.log("WELCOME ERROR:", err);
  }
};
