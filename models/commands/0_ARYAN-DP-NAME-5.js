
module.exports.config = {
  name: "dpname5",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "LEGEND-ARYAN (Fixed by ChatGPT)",
  description: "DP Name Maker",
  commandCategory: "dpname",
  usages: "text1 + text2",
  cooldowns: 1
};

const wrapText = async (ctx, text, maxWidth) => {
  if (!text) return [];
  if (ctx.measureText(text).width < maxWidth) return [text];

  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let word of words) {
    if (ctx.measureText(line + word).width < maxWidth) {
      line += word + " ";
    } else {
      lines.push(line.trim());
      line = word + " ";
    }
  }
  if (line) lines.push(line.trim());
  return lines;
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const Canvas = global.nodemodule["canvas"];
  const { loadImage, createCanvas } = Canvas;
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const path = require("path");

  // ✅ Argument check
  const input = args.join(" ").split("+").map(e => e.trim());
  if (!input[0] || !input[1]) {
    return api.sendMessage(
      "❌ Format galat hai\n\n✅ Use:\n dpname5 Text1 + Text2",
      threadID,
      messageID
    );
  }

  // ✅ Cache folder
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const imgPath = path.join(cacheDir, "dpname5.png");
  const fontPath = path.join(cacheDir, "SNAZZYSURGE.ttf");

  // ✅ Background image
  if (!fs.existsSync(imgPath)) {
    const img = await axios.get(
      "https://i.imgur.com/ZQrkbch.jpg",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(imgPath, img.data);
  }

  // ✅ Font download
  if (!fs.existsSync(fontPath)) {
    const font = await axios.get(
      "https://drive.google.com/uc?export=download&id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(fontPath, font.data);
  }

  Canvas.registerFont(fontPath, { family: "SNAZZYSURGE" });

  const baseImage = await loadImage(imgPath);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#000000";
  ctx.font = "30px SNAZZYSURGE";

  const line1 = await wrapText(ctx, input[0], 720);
  const line2 = await wrapText(ctx, input[1], 720);

  line1.forEach((txt, i) => {
    ctx.fillText(txt, 460, 250 + i * 35);
  });

  line2.forEach((txt, i) => {
    ctx.fillText(txt, 250, 510 + i * 35);
  });

  const buffer = canvas.toBuffer();
  fs.writeFileSync(imgPath, buffer);

  return api.sendMessage(
    { attachment: fs.createReadStream(imgPath) },
    threadID,
    () => fs.unlinkSync(imgPath),
    messageID
  );
};
