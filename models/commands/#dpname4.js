module.exports.config = {
  name: "dpname4",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "PRINCE TAIMOOR",
  description: "Create name DPs for 3 different styles",
  commandCategory: "image",
  usages: "[1/2/3] + text1 + text2",
  cooldowns: 2
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
  const input = args.join(" ").split("+").map(item => item.trim());

  if (input.length < 3) {
    return api.sendMessage("❌ Format: dpname6 [1/2/3] + Name1 + Name2\nExample: dpname6 1 + Rahul + Priya", threadID, messageID);
  }

  const choice = input[0];
  const name1 = input[1];
  const name2 = input[2];

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const imgPath = path.join(cacheDir, `dp_${Date.now()}.png`);
  const fontPath = path.join(cacheDir, "SNAZZYSURGE.ttf");

  try {
    if (!fs.existsSync(fontPath)) {
      const fontData = await axios.get("https://drive.google.com/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", { responseType: "arraybuffer" });
      fs.writeFileSync(fontPath, fontData.data);
    }
    registerFont(fontPath, { family: "SNAZZYSURGE" });

    let bgURL, config;

    // Teeno images ki settings
    if (choice == "1") {
      bgURL = "https://i.imgur.com/vHq0L5R.jpg"; // Image 1000043915
      config = { fSize: 38, x1: 285, y1: 435, x2: 700, y2: 915, w: 380 };
    } else if (choice == "2") {
      bgURL = "https://i.ibb.co/3ykG5Mv8/1000043917.jpg"; // Image 1000043917
      config = { fSize: 32, x1: 240, y1: 735, x2: 315, y2: 915, w: 280 };
    } else if (choice == "3") {
      bgURL = "https://i.imgur.com/vHq0L5R.jpg"; // Image 1000043918
      config = { fSize: 22, x1: 245, y1: 510, x2: 725, y2: 920, w: 250 };
    } else {
      return api.sendMessage("❌ Invalid choice! 1, 2 ya 3 select karein.", threadID, messageID);
    }

    const bg = await loadImage(bgURL);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = `${config.fSize}px SNAZZYSURGE`;

    // Draw Name 1
    const lines1 = await module.exports.wrapText(ctx, name1, config.w);
    ctx.fillText(lines1.join("\n"), config.x1, config.y1);

    // Draw Name 2
    const lines2 = await module.exports.wrapText(ctx, name2, config.w);
    ctx.fillText(lines2.join("\n"), config.x2, config.y2);

    fs.writeFileSync(imgPath, canvas.toBuffer());
    return api.sendMessage({ attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("Internal Error: DP generate nahi ho saki.", threadID, messageID);
  }
};
