// commands/user.js - INSTANT BAN WITH DP
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
  name: "user",
  version: "2.0.0", 
  hasPermssion: 1,
  credits: "ARYAN - INSTANT BAN SYSTEM",
  description: "Instant ban with profile DP detection",
  commandCategory: "System",
  cooldowns: 0,
  dependencies: {
    "axios": "",
    "canvas": ""
  }
};

// STORAGE
if (!global.userProtection) {
  global.userProtection = {
    userBanned: new Map(),
    adminUsers: new Set(["100000000000000"]) // YOUR FACEBOOK ID
  };
}

const { userBanned, adminUsers } = global.userProtection;

// INSTANT BAN WORDS - 1 warning me ban
const instantBanWords = [
  "bsdk", "bhosdk", "madarchod", "bhenchod", "chutiya", 
  "mc", "bc", "loda", "randi", "fuck you", "motherfucker",
  "aryan", "bot", "aryan bot", "owner" // Protected names bhi instant ban
];

const CACHE_DIR = path.join(__dirname, "..", "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// 🎨 INSTANT BAN CARD WITH DP
async function createInstantBanCard(userInfo, reason) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // DARK BACKGROUND
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, width, height);

  // MAIN CARD
  ctx.fillStyle = "#2d2d2d";
  ctx.roundRect(50, 30, width - 100, height - 60, 20);
  ctx.fill();

  // RED HEADER
  ctx.fillStyle = "#ff0000";
  ctx.roundRect(50, 30, width - 100, 80, 20);
  ctx.fill();

  // TITLE
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🚨 INSTANT BAN REPORT", width / 2, 75);

  try {
    // USER PROFILE PICTURE
    const profileUrl = `https://graph.facebook.com/${userInfo.id}/picture?width=400&height=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(profileUrl, { responseType: 'arraybuffer' });
    const profileBuffer = Buffer.from(response.data);
    const profileImage = await loadImage(profileBuffer);

    // PROFILE FRAME
    const avatarSize = 120;
    const avatarX = 80;
    const avatarY = 140;

    // CIRCULAR PROFILE PICTURE
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profileImage, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // PROFILE BORDER
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
    ctx.stroke();

  } catch (error) {
    console.log("DP load error:", error);
    // FALLBACK AVATAR
    ctx.fillStyle = "#555555";
    ctx.beginPath();
    ctx.arc(140, 200, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("👤", 140, 215);
  }

  // USER INFO
  const infoX = 250;
  const infoY = 140;

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`👤 ${userInfo.name}`, infoX, infoY + 40);

  ctx.fillStyle = "#cccccc";
  ctx.font = "18px Arial";
  ctx.fillText(`🆔 ${userInfo.id}`, infoX, infoY + 70);

  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 20px Arial";
  ctx.fillText(`⏰ Ban Duration: 48 HOURS`, infoX, infoY + 110);

  // REASON BOX
  ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
  ctx.roundRect(infoX, infoY + 130, 400, 60, 10);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.fillText(`🔨 Reason: ${reason}`, infoX + 10, infoY + 155);

  ctx.fillStyle = "#ffaaaa";
  ctx.font = "14px Arial";
  ctx.fillText("Instant ban for violation of rules", infoX + 10, infoY + 175);

  // FOOTER
  const timeStr = new Date().toLocaleString("en-IN", { 
    timeZone: "Asia/Kolkata",
    hour12: true 
  });

  ctx.fillStyle = "#888888";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`🚀 Aryan Protection System • ${timeStr}`, width / 2, height - 20);

  return canvas.toBuffer("image/png");
}

// CANVAS ROUNDRECT SUPPORT
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

// ✅ MIRAI COMMAND HANDLER
module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  try {
    const command = args[0]?.toLowerCase();

    // 🔓 UNBAN COMMAND
    if (command === "unban" && args[1]) {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can unban users.", threadID, messageID);
      }

      const targetUID = args[1];
      if (userBanned.has(targetUID)) {
        userBanned.delete(targetUID);
        
        // GET USER NAME FOR MESSAGE
        let userName = targetUID;
        try {
          const userInfo = await api.getUserInfo(targetUID);
          userName = userInfo[targetUID]?.name || targetUID;
        } catch (e) {}
        
        return api.sendMessage(`✅ User ${userName} (${targetUID}) has been unbanned.`, threadID, messageID);
      } else {
        return api.sendMessage(`❌ User ${targetUID} is not banned.`, threadID, messageID);
      }
    }

    // 📋 BANNED LIST
    if (command === "list") {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can view banned list.", threadID, messageID);
      }

      const bannedUsers = [];
      for (const [uid, banTime] of userBanned.entries()) {
        if (Date.now() < banTime) {
          bannedUsers.push({
            id: uid,
            timeLeft: Math.floor((banTime - Date.now()) / (1000 * 60 * 60)) // hours left
          });
        } else {
          userBanned.delete(uid); // clean expired
        }
      }

      if (bannedUsers.length === 0) {
        return api.sendMessage("✅ No users are currently banned.", threadID, messageID);
      }

      const listText = bannedUsers.map(user => 
        `• ${user.id} (${user.timeLeft}h left)`
      ).join('\n');

      return api.sendMessage(
        `📋 INSTANT BANNED USERS:\n\n${listText}\n\nUse "user unban UID" to unban.`,
        threadID, messageID
      );
    }

    // 🧹 CLEAN BANS
    if (command === "clean") {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can clean bans.", threadID, messageID);
      }

      let cleaned = 0;
      for (const [uid, time] of userBanned.entries()) {
        if (Date.now() >= time) {
          userBanned.delete(uid);
          cleaned++;
        }
      }

      return api.sendMessage(`✅ Cleaned ${cleaned} expired bans.`, threadID, messageID);
    }

    // 🔨 MANUAL BAN
    if (command === "ban" && args[1]) {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can ban users.", threadID, messageID);
      }

      const targetUID = args[1];
      const reason = args.slice(2).join(" ") || "Manual ban by admin";
      
      try {
        const userInfo = await api.getUserInfo(targetUID);
        const userName = userInfo[targetUID]?.name || "User";
        
        // CREATE BAN CARD
        const banCard = await createInstantBanCard(
          { id: targetUID, name: userName }, 
          reason
        );
        
        const cardPath = path.join(CACHE_DIR, `manual_ban_${targetUID}.png`);
        fs.writeFileSync(cardPath, banCard);
        
        // BAN USER
        userBanned.set(targetUID, Date.now() + (48 * 60 * 60 * 1000)); // 48 hours
        
        return api.sendMessage({
          body: `🔨 MANUAL BAN SUCCESS!\n\nUser: ${userName}\nID: ${targetUID}\nDuration: 48 hours`,
          attachment: fs.createReadStream(cardPath)
        }, threadID, messageID);
        
      } catch (error) {
        return api.sendMessage(`❌ Error banning user: ${error.message}`, threadID, messageID);
      }
    }

    // ℹ️ HELP
    return api.sendMessage(
      `🚀 INSTANT BAN SYSTEM\n\n` +
      `• user ban [UID] [reason] - Manual ban (admin)\n` +
      `• user unban [UID] - Unban user (admin)\n` +
      `• user list - Banned users (admin)\n` +
      `• user clean - Clean bans (admin)\n\n` +
      `⚠️ Instant ban for: abusive words, protected names`,
      threadID, messageID
    );

  } catch (error) {
    console.error("Command error:", error);
    api.sendMessage("❌ System error.", threadID, messageID);
  }
};

// ✅ INSTANT BAN EVENT HANDLER
module.exports.handleEvent = async function({ event, api }) {
  try {
    const { senderID, body, threadID, messageID } = event;

    // SKIP IF NO MESSAGE OR ADMIN
    if (!body || adminUsers.has(senderID.toString())) return;

    const uid = senderID.toString();
    const message = body.toLowerCase();

    // CHECK IF ALREADY BANNED
    if (userBanned.has(uid)) {
      const banTime = userBanned.get(uid);
      if (Date.now() < banTime) {
        api.sendMessage({
          body: `❌ You are banned for 48 hours. Contact admin.`
        }, threadID, messageID);
        return;
      } else {
        userBanned.delete(uid);
      }
    }

    // CHECK FOR INSTANT BAN WORDS
    const hasBannedWord = instantBanWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(message);
    });

    if (hasBannedWord) {
      try {
        // GET USER INFO AND PROFILE PICTURE
        const userInfo = await api.getUserInfo(uid);
        const userName = userInfo[uid]?.name || "User";
        
        console.log(`[INSTANT-BAN] Banning user: ${userName} (${uid}) for: ${message}`);

        // CREATE BAN CARD WITH PROFILE DP
        const banCard = await createInstantBanCard(
          { id: uid, name: userName },
          `Using prohibited content: "${body.substring(0, 50)}..."`
        );

        // SAVE CARD
        const cardPath = path.join(CACHE_DIR, `ban_${uid}_${Date.now()}.png`);
        fs.writeFileSync(cardPath, banCard);

        // BAN USER FOR 48 HOURS
        userBanned.set(uid, Date.now() + (48 * 60 * 60 * 1000));

        // SEND BAN MESSAGE WITH CARD
        await api.sendMessage({
          body: `🚨 INSTANT BAN APPLIED!\n\n` +
                `User violated protection rules.\n` +
                `Duration: 48 HOURS\n` +
                `Admin can unban using: user unban ${uid}`,
          attachment: fs.createReadStream(cardPath)
        }, threadID, messageID);

        console.log(`[SUCCESS] User ${uid} instantly banned with DP card`);

      } catch (error) {
        console.error("Ban process error:", error);
        // FALLBACK: SIMPLE BAN WITHOUT CARD
        userBanned.set(uid, Date.now() + (48 * 60 * 60 * 1000));
        api.sendMessage({
          body: `🚨 INSTANT BAN!\n\nYou used prohibited content.\nBan: 48 hours\nUse: user unban ${uid} (admin only)`
        }, threadID, messageID);
      }
    }

  } catch (error) {
    console.error("Instant ban system error:", error);
  }
};

// MIRAI COMPATIBILITY
module.exports.run = module.exports.onStart;
