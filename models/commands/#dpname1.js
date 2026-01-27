module.exports.config = {
  name: "dpname1",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "PRINCE TAIMOOR / Gemini",
  description: "Couple DP maker with custom names",
  commandCategory: "image",
  usages: "Name1 + Name2",
  cooldowns: 1
};

const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // Input check
  const fullText = args.join(" ");
  if (!fullText.includes("+")) {
    return api.sendMessage(
      "❌ Galat format! Sahi tarika:\ndpname1 Name1 + Name2",
      threadID,
      messageID
    );
  }

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const imgPath = path.join(cacheDir, `dp_${Date.now()}.png`);
  const fontPath = path.join(cacheDir, "SNAZZYSURGE.ttf");

  const names = fullText.split("+").map(t => t.trim());

  try {
    // Font download logic
    if (!fs.existsSync(fontPath)) {
      const fontUrl = "https://drive.google.com/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download";
      const fontData = await axios.get(fontUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(fontPath, Buffer.from(fontData.data));
    }

    registerFont(fontPath, { family: "SNAZZYSURGE" });

    // Background Image
    const bgUrl = "https://i.ibb.co/KpjXky7R/5b2378c33eed.jpg";
    const bg = await loadImage(bgUrl);
    
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // Draw Background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
    // Font styling
    ctx.fillStyle = "#000000"; // Black color
    ctx.textAlign = "center";
    ctx.font = "50px SNAZZYSURGE"; // Size adjust kiya gaya hai

    // --- Name 1 (Top Left Box) ---
    // In coordinates ko image ke white box ke hisab se thoda adjust karein
    ctx.fillText(names[0], 225, 735); 

    // --- Name 2 (Bottom Right Box) ---
    ctx.fillText(names[1], 255, 895);

    // Buffer save karein
    const buffer = canvas.toBuffer();
    fs.writeFileSync(imgPath, buffer);

    return api.sendMessage(
      { body: "Aapki DP taiyaar hai! ❤️", attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );

  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred: " + error.message, threadID, messageID);
  }
};
