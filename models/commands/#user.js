// commands/user.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "user",
  version: "3.0.2",
  hasPermssion: 1,
  credits: "Modified by ChatGPT for Aryan",
  description: "User protection: auto-ban & messenger-style ban screenshot",
  commandCategory: "System",
  cooldowns: 1
};

// runtime storage
global.data = global.data || {};
global.data.userBanned = global.data.userBanned || new Map();

const abuseWords = [
  "bsdk","bhosdk","bhosdike","madarchod","bhenchod","mc","bc",
  "chutiya","gaand","kutta","suvar","randi","loda","launde",
  "btc","sale","saale","fuck you","motherfucker"
];

const CACHE_DIR = path.join(__dirname, "..", "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// ---------------- Helpers ----------------
async function downloadImageBuffer(url) {
  try {
    const resp = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
    return Buffer.from(resp.data, "binary");
  } catch (e) {
    return null;
  }
}

async function fetchUserInfo(api, uid) {
  try {
    if (typeof api.getUserInfo === "function") {
      const info = await api.getUserInfo(uid);
      if (info && info[uid]) return info[uid];
      if (info && info.name) return info;
    }
  } catch (err) {}
  return { id: uid, name: `User ${uid}`, avatarUrl: null };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

async function createBanImage({ name, uid, reason, dpBuffer }) {
  const width = 900;
  const height = 360;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f0f2f5";
  ctx.fillRect(0, 0, width, height);

  const panelX = 18, panelY = 18, panelW = width - 36, panelH = height - 36;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, panelX, panelY, panelW, panelH, 14);
  ctx.fill();

  // Header
  ctx.fillStyle = "#0084ff";
  roundRect(ctx, panelX, panelY, panelW, 72, 14);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Sans";
  ctx.fillText("🚨 BABU TU BAN HAI RE 🚫", panelX + 20, panelY + 45);

  // Avatar
  const avatarX = panelX + 20, avatarY = panelY + 100, avatarSize = 140;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = "#f0f2f5";
  ctx.fill();

  if (dpBuffer) {
    try {
      const img = await loadImage(dpBuffer);
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();
    } catch (e) {
      ctx.fillStyle = "#d0d0d0";
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
  } else {
    ctx.fillStyle = "#d0d0d0";
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
  }

  // Info
  const infoX = avatarX + avatarSize + 30;
  const infoY = avatarY;
  ctx.fillStyle = "#111827";
  ctx.font = "bold 26px Sans";
  ctx.fillText(name, infoX, infoY + 30);

  ctx.font = "16px Sans";
  ctx.fillStyle = "#374151";
  ctx.fillText(`UID: ${uid}`, infoX, infoY + 68);

  ctx.fillStyle = "#fff5f5";
  roundRect(ctx, infoX, infoY + 86, panelW - infoX - 40, 72, 8);
  ctx.fill();

  ctx.fillStyle = "#b91c1c";
  ctx.font = "bold 18px Sans";
  ctx.fillText("Reason:", infoX + 12, infoY + 112);

  ctx.fillStyle = "#991b1b";
  ctx.font = "16px Sans";
  wrapText(ctx, reason, infoX + 90, infoY + 112, panelW - infoX - 120, 20);

  const timeStr = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" });
  ctx.fillStyle = "#374151";
  ctx.font = "14px Sans";
  ctx.fillText(`Action: 24 hours ban`, panelX + 22, panelY + panelH - 30);
  ctx.fillText(`Time: ${timeStr}`, panelX + 220, panelY + panelH - 30);

  return canvas.toBuffer("image/png");
}

// ---------------- Command ----------------
module.exports.run = async function({ api, event, args }) {
  const uid = event.senderID;
  const message = (event.body || "").toLowerCase();

  // Check abusive
  const isAbusive = abuseWords.some(word => message.includes(word));
  if (!isAbusive) return;

  if (global.data.userBanned.has(uid)) {
    return api.sendMessage("User already banned!", event.threadID);
  }

  // Fetch user info
  const userInfo = await fetchUserInfo(api, uid);
  const dpBuffer = await downloadImageBuffer(userInfo.avatarUrl || "");

  // Create ban image
  const banImg = await createBanImage({
    name: userInfo.name,
    uid,
    reason: "Abusive language detected",
    dpBuffer
  });

  const filePath = path.join(CACHE_DIR, `ban_${uid}.png`);
  fs.writeFileSync(filePath, banImg);

  // ---------------- Actual Ban ----------------
  try {
    await api.removeUserFromGroup(uid, event.threadID); // remove user from group
  } catch (err) {
    console.log("Ban failed:", err.message);
  }

  // Mark as banned locally
  global.data.userBanned.set(uid, true);

  // Send ban image
  api.sendMessage({
    body: `🚨 User ${userInfo.name} banned for abusive language!`,
    attachment: fs.createReadStream(filePath)
  }, event.threadID);
};
