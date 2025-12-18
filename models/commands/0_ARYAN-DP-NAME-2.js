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

  const input = args.join(" ").split("+");
  if (!input[0] || !input[1]) return api.sendMessage("❌ Format: dpname2 Text 1 + Text 2", threadID, messageID);

  const text1 = input[0].trim();
  const text2 = input[1].trim();
  
  const pathImg = __dirname + `/cache/drake_${threadID}.png`;
  const pathFont = __dirname + `/cache/font_svn.ttf`;

  try {
    // 1. Font Download (Alternative link agar pehla wala 404 de raha hai)
    if (!fs.existsSync(pathFont)) {
      const fontUrl = `https://github.com/hpro123/font/raw/main/SVN-Arial%202.ttf`;
      try {
        const getfont = (await axios.get(fontUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathFont, Buffer.from(getfont, "utf-8"));
      } catch (e) {
        return api.sendMessage("❌ Font download fail ho gaya (404). Link change karein.", threadID, messageID);
      }
    }

    // 2. Background Image Download
    // Note: Drake meme template ka stable link use kiya hai
    const imgUrl = `https://i.imgflip.com/30zz5g.jpg`; 
    try {
      const getImage = (await axios.get(encodeURI(imgUrl), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
    } catch (e) {
      return api.sendMessage("❌ Background image link 404 hai.", threadID, messageID);
    }

    // 3. Canvas Setup
    registerFont(pathFont, { family: "SVN-Arial-2" });
    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "40px SVN-Arial-2"; // Font size adjust kiya template ke liye
    ctx.fillStyle = "#000000";

    // Drake Template Coordinates (Approximate)
    const line1 = await this.wrapText(ctx, text1, 250);
    const line2 = await this.wrapText(ctx, text2, 250);

    ctx.fillText(line1.join("\n"), 250, 100); // Pehla box
    ctx.fillText(line2.join("\n"), 250, 350); // Dusra box

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );

  } catch (e) {
    return api.sendMessage(`⚠️ Error: ${e.message}`, threadID, messageID);
  }
};

