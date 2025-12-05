module.exports.config = {
  name: "uid",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "M.R LEGEND ARYAN",
  description: "Generate futuristic Facebook info card with 3D effects",
  commandCategory: "Tools",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const { createCanvas, loadImage } = require("canvas");
  const path = require("path");
  const axios = require("axios");

  let uid, name;

  if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
    name = event.mentions[uid].replace("@", "");
  } else {
    uid = event.senderID;
    try {
      const userInfo = await api.getUserInfo(uid);
      name = userInfo[uid].name || "Facebook User";
    } catch {
      name = "Facebook User";
    }
  }

  try {
    // Higher quality DP
    const dpURL = `https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const tempDP = __dirname + `/cache/dp_temp_${uid}.jpg`;

    // Download profile picture
    await axios.get(dpURL, { responseType: 'stream' })
      .then(response => {
        const writer = fs.createWriteStream(tempDP);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      });

    const img = await loadImage(tempDP);

    // Create larger canvas for more details
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext("2d");

    // Futuristic gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, "#0f0c29");
    gradient.addColorStop(0.5, "#302b63");
    gradient.addColorStop(1, "#24243e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Add glowing particles/effects
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1200;
      const y = Math.random() * 800;
      const radius = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw futuristic grid lines
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 1200; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 800);
      ctx.stroke();
    }
    for (let i = 0; i < 800; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1200, i);
      ctx.stroke();
    }

    // Create 3D-like circular DP container
    const centerX = 300;
    const centerY = 400;
    const radius = 180;

    // Outer glow effect
    const glow = ctx.createRadialGradient(
      centerX, centerY, radius,
      centerX, centerY, radius + 50
    );
    glow.addColorStop(0, "rgba(0, 255, 255, 0.5)");
    glow.addColorStop(1, "rgba(0, 255, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
    ctx.fill();

    // Metallic ring
    for (let i = 0; i < 3; i++) {
      const ringGradient = ctx.createRadialGradient(
        centerX, centerY, radius + 15 - i * 2,
        centerX, centerY, radius + 20 - i * 2
      );
      ringGradient.addColorStop(0, i === 0 ? "#00ffff" : "#ffffff");
      ringGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");
      ctx.strokeStyle = ringGradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10 - i * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Clip for circular DP
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
    ctx.clip();

    // Draw DP with slight rotation for dynamic look
    ctx.translate(centerX, centerY);
    ctx.rotate(0.05); // Slight tilt for dynamic effect
    ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();

    // Add scan lines over DP (futuristic effect)
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = -radius; i < radius; i += 20) {
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY + i);
      ctx.lineTo(centerX + radius, centerY + i);
      ctx.stroke();
    }

    // Futuristic info panel
    const panelX = 650;
    const panelY = 200;
    const panelWidth = 500;
    const panelHeight = 400;

    // Panel background with glass morphism effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 25);
    ctx.fill();

    // Panel border with neon effect
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 25);
    ctx.stroke();

    // Inner shadow for 3D effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Title with glowing effect
    ctx.font = "bold 36px 'Arial'";
    const title = "USER PROFILE";
    const titleWidth = ctx.measureText(title).width;
    
    // Title background
    ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.roundRect(panelX + 20, panelY - 30, titleWidth + 40, 60, 15);
    ctx.fill();
    
    // Title text with gradient
    const titleGradient = ctx.createLinearGradient(
      panelX + 40, panelY - 10,
      panelX + 40 + titleWidth, panelY - 10
    );
    titleGradient.addColorStop(0, "#00ffff");
    titleGradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = titleGradient;
    ctx.fillText(title, panelX + 40, panelY + 10);

    // Info content
    const infoStartY = panelY + 70;
    const lineHeight = 50;

    // Get current date/time with better formatting
    const moment = require("moment-timezone");
    moment.tz.setDefault("Asia/Dhaka");
    
    const date = moment().format("DD MMMM YYYY");
    const time = moment().format("hh:mm:ss A");
    const day = moment().format("dddd");
    const timestamp = moment().unix();

    // Draw info items with icons
    const infoItems = [
      { icon: "👤", label: "NAME", value: name.length > 20 ? name.substring(0, 20) + "..." : name },
      { icon: "🆔", label: "USER ID", value: uid },
      { icon: "📅", label: "DATE", value: date },
      { icon: "🕒", label: "TIME", value: time },
      { icon: "📆", label: "DAY", value: day },
      { icon: "⏱️", label: "TIMESTAMP", value: timestamp.toString() }
    ];

    infoItems.forEach((item, index) => {
      const y = infoStartY + (index * lineHeight);
      
      // Draw icon
      ctx.font = "28px Arial";
      ctx.fillStyle = "#00ffff";
      ctx.fillText(item.icon, panelX + 40, y);
      
      // Draw label
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(item.label, panelX + 80, y);
      
      // Draw value
      ctx.font = "20px 'Courier New'";
      ctx.fillStyle = "#00ff00";
      ctx.fillText(item.value, panelX + 200, y);
    });

    // Add decorative binary code effect
    ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
    ctx.font = "16px 'Courier New'";
    for (let i = 0; i < 20; i++) {
      const binary = Math.random() > 0.5 ? "1" : "0";
      const x = Math.random() * 1200;
      const y = Math.random() * 800;
      ctx.fillText(binary, x, y);
    }

    // Footer with glowing text
    ctx.font = "italic 18px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.textAlign = "center";
    ctx.fillText("┌──────────────────────────────────────────────────────────────────┐", 600, 750);
    ctx.fillText("│                SYSTEM GENERATED - M.R ARYAN's BOT                │", 600, 775);
    ctx.fillText("└──────────────────────────────────────────────────────────────────┘", 600, 800);

    // Save the image
    const outputPath = __dirname + `/cache/futuristic_${uid}.png`;
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    
    await new Promise((resolve, reject) => {
      stream.pipe(out);
      out.on('finish', resolve);
      out.on('error', reject);
    });

    // Create message with emoji border
    const border = "✦•······················•✦";
    const msg = `
${border}
╔══════════════════════════════════════╗
║       🚀 **USER INFO GENERATED**       ║
╚══════════════════════════════════════╝

🎯 **USER DETAILS:**
• 👤 Name: ${name}
• 🆔 UID: ${uid}
• 📅 Date: ${date}
• 🕒 Time: ${time}
• 📆 Day: ${day}
• ⏱️ Timestamp: ${timestamp}

${border}
✨ _Futuristic design generated successfully!_
${border}`;

    // Send the image
    await api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(outputPath)
    }, event.threadID);

    // Cleanup
    fs.unlinkSync(tempDP);
    fs.unlinkSync(outputPath);

  } catch (error) {
    console.error("Error in uid command:", error);
    api.sendMessage(
      "❌ An error occurred while generating the futuristic profile card.\n\nPlease try again later or contact the bot administrator.",
      event.threadID,
      event.messageID
    );
  }
};

// Add roundRect method if not exists
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}
