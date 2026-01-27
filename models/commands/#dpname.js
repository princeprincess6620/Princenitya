module.exports.config = {
  name: "dpname",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU | Fully Fixed",
  description: "dpname maker",
  commandCategory: "image",
  usages: "text1 + text2",
  cooldowns: 1
};

// ✅ SIMPLE WRAP TEXT (STABLE)
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
    const imgPath = cacheDir + "/dpname.png";

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // ✅ BACKGROUND IMAGE
    const bg = await axios.get(
      "https://i.imgur.com/nJPIeQS.jpg",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(imgPath, Buffer.from(bg.data));

    // ✅ CANVAS
    const baseImage = await loadImage(imgPath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    // ❗ NO CUSTOM FONT (ERROR FREE)
    ctx.font = "30px sans-serif";

    // ✅ DRAW TEXT
    const line1 = wrapText(ctx, text[0], 400);
    const line2 = wrapText(ctx, text[1], 460);

    ctx.fillText(line1.join("\n"), 360, 70);
    ctx.fillText(line2.join("\n"), 360, 200);

    // ✅ SAVE & SEND
    const buffer = canvas.toBuffer();
    fs.writeFileSync(imgPath, buffer);

    return api.sendMessage(
      { attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );

  } catch (err) {
    console.error("DPNAME ERROR:", err);
    return api.sendMessage(
      "❌ Canvas module missing. VPS / Render use karo.",
      event.threadID,
      event.messageID
    );
  }
};
