module.exports.config = {
name: "dpname1",
version: "1.0.1",
hasPermssion: 0,
credits: "ARIF BABU | Fixed by ChatGPT",
description: "dp name maker",
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
lines.push(line);
line = word + " ";
} else {
line = testLine;
}
}
lines.push(line);
return lines;
};

module.exports.run = async function ({ api, event, args }) {
const { threadID, messageID } = event;

if (!args.join(" ").includes("+")) {
return api.sendMessage(
"❌ Format galat hai\n👉 dpname6 text1 + text2",
threadID,
messageID
);
}

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

const imgPath = path.join(cacheDir, "dpname.png");
const fontPath = path.join(cacheDir, "SNAZZYSURGE.ttf");

const text = args.join(" ").split("+");

if (!fs.existsSync(fontPath)) {
const fontData = await axios.get(
"https://drive.google.com/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download",
{ responseType: "arraybuffer" }
);
fs.writeFileSync(fontPath, fontData.data);
}

registerFont(fontPath, { family: "SNAZZYSURGE" });

const bg = await loadImage("https://i.ibb.co/KpjXky7R/5b2378c33eed.jpg");
const canvas = createCanvas(bg.width, bg.height);
const ctx = canvas.getContext("2d");

ctx.drawImage(bg, 0, 0);
ctx.font = "30px SNAZZYSURGE";
ctx.fillStyle = "#000000";
ctx.textAlign = "center";

const line1 = await module.exports.wrapText(ctx, text[0], 800);
const line2 = await module.exports.wrapText(ctx, text[1], 733);

ctx.fillText(line1.join("\n"), 80, 110);
ctx.fillText(line2.join("\n"), 260, 100);

fs.writeFileSync(imgPath, canvas.toBuffer());

return api.sendMessage(
{ attachment: fs.createReadStream(imgPath) },
threadID,
() => fs.unlinkSync(imgPath),
messageID
);
};
