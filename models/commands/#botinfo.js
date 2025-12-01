// botinfo.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "botinfo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ARYAN",
  description: "Show bot info card (with owner profile)",
  usages: "",
  commandCategory: "info",
  cooldowns: 5
};

// YOUR OWNER ID (Already Added)
const ownerID = "61580003810694";

module.exports.run = async ({ api, event, args }) => {
  try {
    const { senderID, threadID } = event;

    let senderName = "User";
    let botID = api.getCurrentUserID();
    let botName = "FB Bot";
    let prefix = "."; // Change if different

    try {
      const info = await new Promise((res, rej) =>
        api.getUserInfo(senderID, (err, data) => err ? rej(err) : res(data))
      );
      senderName = info[senderID].name;
    } catch {}

    let commandsCount = "N/A";
    try {
      if (global.client && global.client.commands)
        commandsCount = Object.keys(global.client.commands).length;
    } catch {}

    const ownerPicUrl = `https://graph.facebook.com/${ownerID}/picture?type=large`;
    const senderPicUrl = `https://graph.facebook.com/${senderID}/picture?type=large`;

    const [ownerImg, senderImg] = await Promise.all([
      loadImage(ownerPicUrl).catch(() => null),
      loadImage(senderPicUrl).catch(() => null)
    ]);

    const width = 900, height = 1200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#2b2b2f";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1f2327";
    roundRect(ctx, 60, 180, 780, 760, 30, true);

    // Title Box
    ctx.fillStyle = "#111214";
    roundRect(ctx, 100, 120, 700, 70, 10, true);
    ctx.font = "bold 32px Sans";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("BOT INFORMATION", 140, 165);

    // Text Content
    ctx.fillStyle = "#ffd98a";
    ctx.font = "26px Sans";
    ctx.fillText(`👋 Hi ${senderName}!`, 140, 230);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Sans";
    ctx.fillText(`🤖 Bot Name: ${botName}`, 140, 270);
    ctx.fillText(`🆔 Bot ID: ${botID}`, 140, 310);
    ctx.fillText(`📌 Prefix: ${prefix}`, 140, 350);
    ctx.fillText(`📚 Commands: ${commandsCount}`, 140, 390);
    ctx.fillText(`💡 Type "${prefix}help" to view commands`, 140, 430);

    // Owner Box
    ctx.fillStyle = "#222427";
    roundRect(ctx, 100, 520, 700, 220, 15, true);

    drawCircleImage(ctx, ownerImg, 180, 620, 70);

    let ownerName = "Owner";
    try {
      const info = await new Promise((res, rej) =>
        api.getUserInfo(ownerID, (err, data) => err ? rej(err) : res(data))
      );
      ownerName = info[ownerID].name;
    } catch {}

    ctx.fillStyle = "#ffd98a";
    ctx.font = "26px Sans";
    ctx.fillText(ownerName, 340, 600);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Sans";
    ctx.fillText("BOT OWNER", 340, 640);

    roundRect(ctx, 340, 670, 150, 50, 10, true);
    roundRect(ctx, 510, 670, 150, 50, 10, true);
    ctx.fillText("Profile", 380, 705);
    ctx.fillText("Message", 540, 705);

    const filePath = path.join(__dirname, `botinfo_${Date.now()}.png`);
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    return api.sendMessage(
      { body: "", attachment: fs.createReadStream(filePath) },
      threadID,
      () => fs.unlinkSync(filePath)
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage("❌ Error generating BOT card!", event.threadID);
  }
};

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  if (fill) ctx.fill();
}

function drawCircleImage(ctx, img, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  if (img) ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}
