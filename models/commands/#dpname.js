const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
  name: "dpname",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU | Fixed",
  description: "dpname maker",
  commandCategory: "dpname",
  usages: "text1 + text2",
  cooldowns: 1
};

// ✅ FIXED wrapText (this issue removed)
async function wrapText(ctx, text, maxWidth) {
  if (!text) return [""];
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
  lines.push(line.trim());
  return lines;
}

module.exports.run = async function ({ api, event, args }) {
  try {
    const { threadID, messageID } = event;

    // ✅ INPUT CHECK
    const text = args.join(" ").split("+").map(t => t.trim());
    if (!text[0] || !text[1]) {
      return api.sendMessage(
        "❌ Use:\n\ndpname text1 + text2",
        threadID,
        messageID
      );
    }

    // ✅ PATHS
    const cacheDir = __dirname + "/cache";
    const pathImg = cacheDir + "/dpname.png";
    const fontPath = cacheDir + "/SVN-Arial-2.ttf";

    // ✅ ENSURE CACHE
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // ✅ DOWNLOAD BACKGROUND
    const imgData = await axios.get(
      "https://i.imgur.com/nJPIeQS.jpg",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(pathImg, Buffer.from(imgData.data));

    // ✅ DOWNLOAD FONT ONCE
    if (!fs.existsSync(fontPath)) {
      const fontData = await axios.get(
        "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf",
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync(fontPath, Buffer.from(fontData.data));
    }

    // ✅ CANVAS SETUP
    registerFont(fontPath, { family: "SVNArial" });
    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "30px SVNArial";

    // ✅ TEXT DRAW
    const line1 = await wrapText(ctx, text[0], 400);
    const line2 = await wrapText(ctx, text[1], 464);

    ctx.fillText(line1.join("\n"), 360, 67);
    ctx.fillText(line2.join("\n"), 360, 197);

    // ✅ SAVE & SEND
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );

  } catch (e) {
    console.error(e);
    return api.sendMessage(
      "❌ Error aa gaya, dobara try karo",
      event.threadID,
      event.messageID
    );
  }
};
