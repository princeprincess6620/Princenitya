const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "botinfo",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "ARYAN",
  description: "Premium bot info card with owner avatar, UID and profile link",
  usages: ".",
  commandCategory: "system",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  try {
    const botName = "MISTY QUEEN";
    const prefix = ".";
    const commandsCount = "14";
    const totalUsers = "1784";
    const totalThreads = "24";
    const ownerName = "ARYAN";
    const ownerID = "61580003810694";

    const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=512&height=512`;

    const width = 760, height = 1280;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#162447");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Card container
    function roundRect(x, y, w, h, r, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
    }
    roundRect(60, 120, width - 120, 960, 28, "#eaf6f0");

    // Title
    ctx.fillStyle = "#0f3057";
    ctx.font = "bold 50px Arial";
    ctx.fillText("BOT INFORMATION", 120, 200);

    let y = 300, lh = 70;
    function info(label, value, color = "#071117", bold = false) {
      ctx.font = bold ? "bold 34px Arial" : "32px Arial";
      ctx.fillStyle = color;
      ctx.fillText(`${label} ${value}`, 120, y);
      y += lh;
    }

    info("🤖 Bot Name:", botName, "#0f3057", true);
    info("📌 Prefix:", prefix, "#0f3057", true);
    info("📊 Commands:", commandsCount, "#ff6f61", true);
    info("👥 Total Users:", totalUsers, "#ff6f61", true);
    info("💬 Total Threads:", totalThreads, "#ff6f61", true);
    info("👑 Owner:", ownerName, "#162447", true);
    info("🆔 Owner UID:", ownerID, "#ff6f61", true);
    info("🔗 Profile Link:", `https://www.facebook.com/profile.php?id=${ownerID}`, "#0f3057", true);

    // Load avatar
    let avatar = null;
    try {
      const img = await axios.get(avatarURL, { responseType: "arraybuffer" });
      avatar = await loadImage(Buffer.from(img.data, "binary"));
    } catch { }

    if (avatar) {
      ctx.save();
      // Circular avatar with border
      const avatarX = 160;
      const avatarY = height - 220;
      const avatarRadius = 84;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius + 6, 0, Math.PI * 2, true);
      ctx.fillStyle = "#ff6f61"; // border color
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.restore();
    }

    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#0f3057";
    ctx.fillText(ownerName, 260, height - 250);

    const filePath = path.join(__dirname, `botinfo_${Date.now()}.png`);
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    return api.sendMessage(
      {
        body: `🌟 ${botName} Information`,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );

  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ Error generating premium card.", event.threadID);
  }
};
