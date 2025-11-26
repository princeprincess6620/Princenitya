// commands/user.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "user",
  version: "3.0.0",
  hasPermssion: 1,
  credits: "Modified By ChatGPT for Aryan",
  description: "User protection: auto-ban & messenger-style ban screenshot",
  commandCategory: "System",
  cooldowns: 1
};

// runtime storage
const spamUsers = new Map();
const whitelist = new Set();
global.data = global.data || {};
global.data.userBanned = global.data.userBanned || new Map();

// protected names & abusive keywords
const protectedNames = ["aryan", "bot", "aryan bot", "aryan babu"];
const abuseWords = [
  "bsdk", "bhosdk", "bhosdike", "madarchod", "bhenchod", "mc", "bc",
  "chutiya", "chut", "gaand", "kutte", "suvar", "randi", "loda", "launde",
  "btc", "sale", "saale", "fuck you", "motherfucker"
];

// ensure cache dir
const CACHE_DIR = path.join(__dirname, "..", "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// helper: download image (returns buffer)
async function downloadImageBuffer(url) {
  try {
    const resp = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
    return Buffer.from(resp.data, "binary");
  } catch (e) {
    return null;
  }
}

// helper: fetch user name via api.getUserInfo (mirai typical) else fallback
async function fetchUserInfo(api, uid) {
  try {
    if (typeof api.getUserInfo === "function") {
      const info = await api.getUserInfo(uid);
      // api.getUserInfo often returns object keyed by id
      if (info && info[uid]) return info[uid];
      if (info && info.name) return info;
    }
  } catch (err) {
    // ignore
  }
  // fallback minimal
  return { id: uid, name: `User ${uid}` };
}

// helper: create messenger style ban image
async function createBanImage({ name, uid, reason, dpBuffer }) {
  // Canvas size — messenger-like panel
  const width = 900;
  const height = 360;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background — light messenger-like
  ctx.fillStyle = "#f0f2f5";
  ctx.fillRect(0, 0, width, height);

  // Left card (avatar)
  ctx.fillStyle = "#ffffff";
  const panelX = 18, panelY = 18, panelW = width - 36, panelH = height - 36;
  roundRect(ctx, panelX, panelY, panelW, panelH, 14);
  ctx.fill();

  // Draw header bar
  ctx.fillStyle = "#0084ff"; // messenger blue
  roundRect(ctx, panelX, panelY, panelW, 72, 14);
  ctx.fill();

  // Title text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Sans";
  ctx.fillText("AUTO BAN REPORT", panelX + 20, panelY + 45);

  // Draw avatar circle
  const avatarX = panelX + 20;
  const avatarY = panelY + 100;
  const avatarSize = 140;

  // white circle background
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = "#f0f2f5";
  ctx.fill();

  // load dp image
  if (dpBuffer) {
    try {
      const img = await loadImage(dpBuffer);
      ctx.save();
      // clip circle
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();
    } catch (e) {
      // fallback plain avatar
      ctx.fillStyle = "#d0d0d0";
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
  } else {
    ctx.fillStyle = "#d0d0d0";
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
  }

  // Right side: info text
  const infoX = avatarX + avatarSize + 30;
  const infoY = avatarY;

  ctx.fillStyle = "#111827";
  ctx.font = "bold 26px Sans";
  ctx.fillText(name, infoX, infoY + 30);

  ctx.font = "16px Sans";
  ctx.fillStyle = "#374151";
  ctx.fillText(`UID: ${uid}`, infoX, infoY + 68);

  // Reason box
  ctx.fillStyle = "#fff5f5";
  roundRect(ctx, infoX, infoY + 86, panelW - infoX - 40, 72, 8);
  ctx.fill();

  ctx.fillStyle = "#b91c1c";
  ctx.font = "bold 18px Sans";
  ctx.fillText("Reason:", infoX + 12, infoY + 112);

  ctx.fillStyle = "#991b1b";
  ctx.font = "16px Sans";
  // wrap reason if long
  wrapText(ctx, reason, infoX + 90, infoY + 112, panelW - infoX - 120, 20);

  // footer: action and time
  const timeStr = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" });
  ctx.fillStyle = "#374151";
  ctx.font = "14px Sans";
  ctx.fillText(`Action: 24 hours ban`, panelX + 22, panelY + panelH - 30);
  ctx.fillText(`Time: ${timeStr}`, panelX + 220, panelY + panelH - 30);

  // small warning icon
  ctx.fillStyle = "#ff4d4f";
  ctx.beginPath();
  ctx.moveTo(panelW + panelX - 110, panelY + 36);
  ctx.arc(panelW + panelX - 130, panelY + 36, 10, 0, Math.PI * 2);
  ctx.fill();

  // return buffer
  return canvas.toBuffer("image/png");
}

// small helpers
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + " ";
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

module.exports.run = async function ({ event, api, args }) {
  // keep standard commands: ban/unban/whitelist management
  const { mentions, threadID } = event;
  const cmd = args[0];

  const extractUIDs = () => {
    const uids = Object.keys(mentions || {});
    args.slice(1).forEach(arg => {
      if (!isNaN(arg)) uids.push(arg);
    });
    return uids;
  };

  if (cmd === "ban") {
    const uids = extractUIDs();
    if (uids.length === 0) return api.sendMessage("Mention or UID required.", threadID);
    for (const id of uids) {
      global.data.userBanned.set(id, Date.now());
      api.sendMessage(`🚫 User ${id} banned (manual).`, threadID);
    }
    return;
  }

  if (cmd === "unban") {
    const uids = extractUIDs();
    if (uids.length === 0) return api.sendMessage("Mention or UID required.", threadID);
    for (const id of uids) {
      global.data.userBanned.delete(id);
      api.sendMessage(`✅ User ${id} unbanned.`, threadID);
    }
    return;
  }

  if (cmd === "whitelist") {
    const uids = extractUIDs();
    if (uids.length === 0) return api.sendMessage("Mention or UID required.", threadID);
    for (const id of uids) {
      whitelist.add(id);
      api.sendMessage(`🛡 User ${id} whitelisted.`, threadID);
    }
    return;
  }

  if (cmd === "unwhitelist") {
    const uids = extractUIDs();
    if (uids.length === 0) return api.sendMessage("Mention or UID required.", threadID);
    for (const id of uids) {
      whitelist.delete(id);
      api.sendMessage(`⚠ ${id} removed from whitelist.`, threadID);
    }
    return;
  }

  // default help
  return api.sendMessage(
    "Commands:\n#user ban @user\n#user unban @user\n#user whitelist @user\n#user unwhitelist @user",
    threadID
  );
};

module.exports.handleEvent = async function ({ event, api }) {
  try {
    const messageBody = (event.body || "").toLowerCase();
    const senderID = event.senderID;
    const threadID = event.threadID;
    // ignore if no message
    if (!messageBody) return;

    // ignore whitelisted users
    if (whitelist.has(senderID)) return;

    // if already banned and within 24 hours ignore
    if (global.data.userBanned.has(senderID)) {
      const last = global.data.userBanned.get(senderID);
      if (Date.now() - last < 24 * 60 * 60 * 1000) return;
      else global.data.userBanned.delete(senderID);
    }

    // Spam detection
    if (!spamUsers.has(senderID)) {
      spamUsers.set(senderID, { count: 1, lastMessageTime: Date.now() });
    } else {
      const ud = spamUsers.get(senderID);
      const now = Date.now();
      if (now - ud.lastMessageTime < 5000) ud.count++;
      else ud.count = 1;
      ud.lastMessageTime = now;
      if (ud.count >= 5) {
        // spam ban
        global.data.userBanned.set(senderID, Date.now());
        await api.sendMessage("⚠️ You were detected spamming. You are banned for 24 hours.", threadID);
        spamUsers.delete(senderID);
        return;
      }
      spamUsers.set(senderID, ud);
    }

    // check for abusive content and target protection
    let foundAbuse = null;
    for (const w of abuseWords) {
      if (messageBody.includes(w)) { foundAbuse = w; break; }
    }
    if (!foundAbuse) return; // nothing abusive

    // ensure message targets protected names
    let targetsProtected = false;
    for (const name of protectedNames) {
      if (messageBody.includes(name)) { targetsProtected = true; break; }
    }
    if (!targetsProtected) return; // abuse but not targeted at protected names

    // proceed to ban & create screenshot
    global.data.userBanned.set(senderID, Date.now());

    // fetch user info
    const userInfo = await fetchUserInfo(api, senderID);
    const displayName = userInfo.name || `User ${senderID}`;

    // try fetch DP using graph facebook endpoint (no token) — many setups allow this
    const dpUrl = `https://graph.facebook.com/${senderID}/picture?height=512&width=512`;
    let dpBuffer = await downloadImageBuffer(dpUrl);

    // if dpBuffer null, try fallback default avatar image (a small grey)
    if (!dpBuffer) {
      dpBuffer = null; // will draw fallback in canvas
    }

    const reason = `Used abusive word "${foundAbuse}" targeting Aryan/Bot`;
    const imgBuffer = await createBanImage({ name: displayName, uid: senderID, reason, dpBuffer });

    // save to temp file
    const filename = path.join(CACHE_DIR, `ban_${senderID}_${Date.now()}.png`);
    fs.writeFileSync(filename, imgBuffer);

    // send the image as attachment with a caption
    const message = {
      body: `🚫 Auto Ban — ${displayName} (${senderID})\nReason: ${foundAbuse}\nDuration: 24 hours`,
      attachment: fs.createReadStream(filename)
    };

    await api.sendMessage(message, threadID);

    // cleanup file after short delay
    setTimeout(() => {
      try { fs.unlinkSync(filename); } catch (e) { /* ignore */ }
    }, 60 * 1000);

  } catch (err) {
    // silent fail to avoid crashing bot
    console.error("handleEvent user command error:", err);
  }
};

module.exports.listenGlobal = true;
