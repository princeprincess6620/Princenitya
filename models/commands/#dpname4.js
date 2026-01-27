module.exports.config = {
  name: "dpname4",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "PRINCE TAIMOOR",
  description: "Multipurpose DP maker",
  commandCategory: "image",
  usages: "text1 + text2",
  cooldowns: 1
};

const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.wrapText = async (ctx, text, maxWidth) => {
  if (!text) return [""];
  const words = text.split(" ");
  let lines = [];
  let line = "";
  for (let word of words) {
    let testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  if (!args.join(" ").includes("+")) return api.sendMessage("❌ Format: Name1 + Name2", threadID, messageID);

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const imgPath = path.join(cacheDir, `dp_${Date.now()}.png`);
  const fontPath = path.join(cacheDir, "SNAZZYSURGE.ttf");
  const text = args.join(" ").split("+").map(t => t.trim());

  try {
    if (!fs.existsSync(fontPath)) {
      const fontData = await axios.get("https://drive.google.com/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", { responseType: "arraybuffer" });
      fs.writeFileSync(fontPath, fontData.data);
    }
    registerFont(fontPath, { family: "SNAZZYSURGE" });

    // Yahan apni pasand ki image ka URL dalein
    const bg = await loadImage("https://i.ibb.co/Y4FfcwVR/decb3dbd51b8.jpg"); 
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
    // Default Style (Image 1000043917 ke liye)
    ctx.font = "32px SNAZZYSURGE"; 
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    // Text Wrap & Positioning
    // Box 1
    const line1 = await module.exports.wrapText(ctx, text[0], 280);
    ctx.fillText(line1.join("\n"), 240, 735); 

    // Box 2
    const line2 = await module.exports.wrapText(ctx, text[1], 280);
    ctx.fillText(line2.join("\n"), 315, 915);

    fs.writeFileSync(imgPath, canvas.toBuffer());
    return api.sendMessage({ attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
  } catch (e) {
    return api.sendMessage("Error: " + e.message, threadID, messageID);
  }
};
