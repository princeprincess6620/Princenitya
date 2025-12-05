// File name: prefix.js  (events folder mein daalna hai)

const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "prefix",
  version: "1.0",
  hasPermssion: 0,
  credits: "Priyanshu Style",
  description: "Sirf prefix likhne pe premium owner card",
  commandCategory: "system",
  cooldowns: 3
};

module.exports.handleEvent = async function ({ api, event }) {
  const prefix = global.config.PREFIX;

  if (event.body === prefix || event.body === prefix + " ") {

    const owner = {
      uid: "61580003810694",
      name: "PRIYANSH",
      fburl: "https://www.facebook.com/profile.php?id=61580003810694"
    };

    try {
      // Avatar fetch
      const avt = await loadImage(`https://graph.facebook.com/${owner.uid}/picture?width=1080&height=1080&access_token=EAAD6V7OS0ZAGMBAP2cJZA0ZCBfZCsZBZBZA1rZCzZBZBZBZA`);

      const canvas = createCanvas(1080, 700);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Avatar (Circular)
      ctx.save();
      ctx.beginPath();
      ctx.arc(130, 130, 90, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avt, 40, 40, 180, 180);
      ctx.restore();

      // Main Text Line 1
      ctx.font = "bold 52px Sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText("Trust Me Baby» I Will", 260, 100);

      // Line 2 with emojis
      ctx.font = "bold 58px Sans-serif";
      ctx.fillText("Break Your Heart", 260, 170);

      // Emoji line
      ctx.font = "48px Sans-serif";
      ctx.fillText("╾╾╾┉♡┉╾╾╾", 260, 240);

      // PRIYANSH with crown
      ctx.font = "bold 72px Sans-serif";
      ctx.fillStyle = "#ff66cc";
      ctx.fillText("PRIYANSH", 260, 330);

      // Bottom icons line
      ctx.font = "50px Segoe UI Emoji";
      ctx.fillStyle = "#b0b3b8";
      ctx.fillText("✞ ♪ ✞ ♬ ✞", 260, 400);

      // Facebook tag
      ctx.font = "italic 42px Sans-serif";
      ctx.fillStyle = "#909296";
      ctx.fillText("Facebook", 260, 460);

      // Profile & Message Buttons
      drawButton(ctx, 80, 520, 430, 120, "Profile");
      drawButton(ctx, 560, 520, 430, 120, "Message");

      // Save & Send
      const path = __dirname + "/cache/owner_premium.png";
      fs.writeFileSync(path, canvas.toBuffer());

      api.sendMessage({
        body: "",
        attachment: fs.createReadStream(path),
        url: owner.fburl   // ← Profile button pe click → direct FB khulega
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);

    } catch (e) {
      console.log(e);
    }
  }
};

// Button function
function drawButton(ctx, x, y, w, h, text) {
  ctx.fillStyle = "#2d2d2d";
  roundRect(ctx, x, y, w, h, 60);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px Sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x + w/2, y + h/2 + 15);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
