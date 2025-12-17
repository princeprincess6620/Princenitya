module.exports.config = {
  name: "dpname5",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "LEGEND-ARYAN (Fixed & Improved)",
  description: "DP Name Maker - दो नामों के साथ खूबसूरत DP बनाएं",
  commandCategory: "image",
  usages: "Text1 + Text2",
  cooldowns: 5
};

const wrapText = (ctx, text, maxWidth) => {
  if (!text) return [];
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  try {
    const Canvas = global.nodemodule["canvas"];
    if (!Canvas) {
      return api.sendMessage("❌ Canvas module नहीं मिला। पहले npm install canvas करें।", threadID, messageID);
    }

    const { loadImage, createCanvas, registerFont } = Canvas;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const path = require("path");

    // Input check
    const input = args.join(" ").split("+");
    if (input.length < 2 || !input[0].trim() || !input[1].trim()) {
      return api.sendMessage(
        "❌ गलत फॉर्मेट!\n\n✅ सही तरीका:\n dpname5 पहला नाम + दूसरा नाम\n\nउदाहरण: dpname5 Aryan + Khan",
        threadID,
        messageID
      );
    }

    const text1 = input[0].trim();
    const text2 = input[1].trim();

    // Cache folder
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    const bgPath = path.join(cachePath, "dpname5_bg.jpg");
    const fontPath = path.join(cachePath, "SnazzySurge.ttf");

    // Download background image (एक बार डाउनलोड होगा)
    if (!fs.existsSync(bgPath)) {
      api.sendMessage("⏳ पहली बार यूज़ कर रहे हैं, इमेज डाउनलोड हो रही है...", threadID, messageID);
      const bg = await axios.get("https://i.imgur.com/ZQrkbch.jpg", { responseType: "arraybuffer" });
      fs.writeFileSync(bgPath, Buffer.from(bg.data));
    }

    // Font डाउनलोड (अगर लिंक डेड हो तो fallback यूज़ होगा)
    let fontRegistered = false;
    if (!fs.existsSync(fontPath)) {
      try {
        const font = await axios.get(
          "https://drive.google.com/uc?export=download&id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux",
          { responseType: "arraybuffer", timeout: 10000 }
        );
        fs.writeFileSync(fontPath, Buffer.from(font.data));
      } catch (e) {
        console.log("Font डाउनलोड फेल, default font यूज़ करेंगे।");
      }
    }

    const baseImage = await loadImage(bgPath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Font register (अगर मिला तो)
    if (fs.existsSync(fontPath)) {
      registerFont(fontPath, { family: "SnazzySurge" });
      ctx.font = "60px SnazzySurge";
      fontRegistered = true;
    } else {
      ctx.font = "60px sans-serif"; // fallback
    }

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";

    // Text 1 (ऊपर वाला)
    const lines1 = wrapText(ctx, text1, 700);
    lines1.forEach((line, i) => {
      const y = 250 + i * 70;
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });

    // Text 2 (नीचे वाला)
    ctx.font = fontRegistered ? "50px SnazzySurge" : "50px sans-serif";
    const lines2 = wrapText(ctx, text2, 600);
    lines2.forEach((line, i) => {
      const y = 520 + i * 60;
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });

    // Buffer से direct send
    const buffer = canvas.toBuffer("image/png");

    api.sendMessage(
      {
        body: "👑 यह रहा आपका DP Name! 👑\n\nअगर अच्छा लगा हो तो रिएक्ट कर देना 😊",
        attachment: buffer
      },
      threadID,
      messageID
    );

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ इमेज बनाते समय एरर आया। कृपया दोबारा ट्राय करें या canvas module चेक करें।", threadID, messageID);
  }
};
