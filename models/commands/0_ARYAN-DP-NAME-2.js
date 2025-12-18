module.exports.config = {
  name: "dpname2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "LEGEND-ARYAN",
  description: "dpname maker",
  usePrefix: true,
  commandCategory: "dpname",
  usages: "text 1 + text 2",
  cooldowns: 1
};

// WrapText function ko correctly define kiya gaya hai
module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    const words = text.split(" ");
    const lines = [];
    let line = "";
    while (words.length > 0) {
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
        line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const fs = require("fs-extra");
  const axios = require("axios");
  const { createCanvas, loadImage, registerFont } = require("canvas");

  // Input check
  const input = args.join(" ").split("+");
  if (!input[0] || !input[1]) return api.sendMessage("❌ Galat format! Use: dpname2 Text 1 + Text 2", threadID, messageID);

  const text1 = input[0].trim();
  const text2 = input[1].trim();
  
  const pathImg = __dirname + `/cache/drake_${threadID}.png`;
  const pathFont = __dirname + `/cache/SVNArial2.ttf`;

  try {
    api.sendMessage("⏳ Processing, please wait...", threadID, messageID);

    // 1. Font Download (Agar cache mein nahi hai)
    if (!fs.existsSync(pathFont)) {
      // Direct link placeholder - Replace with a working direct link if drive fails
      let getfont = (await axios.get(`https://github.com/hpro123/font/raw/main/SVN-Arial%202.ttf`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathFont, Buffer.from(getfont, "utf-8"));
    }

    // 2. Image Download
    let getImage = (await axios.get(encodeURI(`https://i.imgur.com/r7w4Vxb.jpeg`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

    // 3. Canvas Operations
    registerFont(pathFont, { family: "SVN-Arial-2" });
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "60px SVN-Arial-2";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    // Text Wrapping
    const line1 = await this.wrapText(ctx, text1, 400);
    const line2 = await this.wrapText(ctx, text2, 464);

    // Text Drawing (Coordinates check karein)
    ctx.fillText(line1.join("\n"), 264, 618);
    ctx.fillText(line2.join("\n"), 441, 505);

    // 4. Send Result
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => {
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
      },
      messageID
    );

  } catch (e) {
    console.log(e);
    return api.sendMessage(`⚠️ Error: ${e.message}`, threadID, messageID);
  }
};

