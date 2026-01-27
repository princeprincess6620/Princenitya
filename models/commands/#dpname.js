module.exports.config = {
  name: "dpname",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "ARIF BABU | Fixed",
  description: "dpname maker",
  commandCategory: "image",
  usages: "text1 + text2",
  cooldowns: 1
};

// ✅ WRAP TEXT (SAFE)
function wrapText(ctx, text, maxWidth) {
  if (!text) return [""];
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let word of words) {
    if (ctx.measureText(line + word).width <= maxWidth) {
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

    const Canvas = global.nodemodule["canvas"];
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const { createCanvas, loadImage } = Canvas;

    // ✅ INPUT
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
    const imgPath = cacheDir + "/dpname.png";
    const fontPath = cacheDir + "/font.ttf";

    // ✅ ENSURE CACHE
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // ✅ BACKGROUND IMAGE
    const bg = await axios.get(
      "https://i.imgur.com/nJPIeQS.jpg",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(imgPath, Buffer.from(bg.data));

    // ✅ FONT DOWNLOAD (ONCE)
    if (!fs.existsSync(fontPath)) {
      const font = await axios.get(
        "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf",
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync(fontPath, Buffer.from(font.data));
    }

    // ✅ LOAD IMAGE
    Canvas.registerFont(fontPath, { family: "RobotoBold" });
    const baseImage = await loadImage(imgPath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "30px RobotoBold";

    // ✅ DRAW TEXT
    const line1 = wrapText(ctx, text[0], 400);
    const line2 = wrapText(ctx, text[1], 460);

    ctx.fillText(line1.join("\n"), 360, 70);
    ctx.fillText(line2.join("\n"), 360, 200);

    // ✅ SAVE
    const buffer = canvas.toBuffer();
    fs.writeFileSync(imgPath, buffer);

    // ✅ SEND
    return api.sendMessage(
      { attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );

  } catch (err) {
    console.error("DPNAME ERROR:", err);
    return api.sendMessage(
      "❌ Canvas / font error. Bot restart karo.",
      event.threadID,
      event.messageID
    );
  }
};
