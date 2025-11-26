// commands/user.js - UNBAN SYSTEM ADDED
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "user",
  version: "6.0.0",
  hasPermssion: 1,
  credits: "🔥 PREMIUM BY ARYAN | UNBAN SYSTEM",
  description: "Advanced User Protection with Unban System",
  commandCategory: "System",
  cooldowns: 0,
  dependencies: {
    "canvas": ""
  }
};

// GLOBAL STORAGE FOR MIRAI
if (!global.premiumProtection) {
  global.premiumProtection = {
    spamUsers: new Map(),
    whitelist: new Set(),
    userBanned: new Map(),
    userWarnings: new Map(),
    premiumUsers: new Set(["100000000000000"]), // YOUR ID HERE
    banHistory: new Map() // NEW: Ban history tracking
  };
}

const { spamUsers, whitelist, userBanned, userWarnings, premiumUsers, banHistory } = global.premiumProtection;

// PROTECTION SETTINGS
const protectedNames = ["aryan", "bot", "aryan bot", "owner"];
const abuseWords = ["bsdk", "mc", "bc", "madarchod", "chutiya", "fuck you"];

const CACHE_DIR = path.join(__dirname, "..", "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// 🔧 MIRAI-COMPATIBLE FUNCTIONS
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function downloadImageBuffer(url) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
      timeout: 10000
    });
    return Buffer.from(response.data);
  } catch (e) {
    return null;
  }
}

// 🎨 UNBAN SUCCESS CARD
async function createUnbanCard(userName, userId, unbannedBy) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Green gradient background for unban
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#00ff00");
  gradient.addColorStop(1, "#008800");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Main Card
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  roundRect(ctx, 20, 20, width - 40, height - 40, 20);
  ctx.fill();

  // Header
  ctx.fillStyle = "#00ff00";
  roundRect(ctx, 20, 20, width - 40, 60, 20);
  ctx.fill();

  // Title
  ctx.fillStyle = "#000000";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("✅ UNBAN SUCCESSFUL", width / 2, 55);

  // User Info
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`User: ${userName}`, 50, 120);

  ctx.font = "18px Arial";
  ctx.fillText(`ID: ${userId}`, 50, 150);
  ctx.fillText(`Unbanned By: ${unbannedBy}`, 50, 180);

  // Success Message
  ctx.fillStyle = "#00ff00";
  ctx.font = "bold 20px Arial";
  ctx.fillText("🎉 User has been successfully unbanned!", 50, 220);

  // Footer
  const timeStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  ctx.fillStyle = "#cccccc";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Mirai Unban System • ${timeStr}`, width / 2, height - 30);

  return canvas.toBuffer("image/png");
}

// 🎨 BANNED LIST CARD
async function createBannedListCard(bannedUsers) {
  const width = 800;
  const height = 400 + (bannedUsers.length * 30);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#ffa500");
  gradient.addColorStop(1, "#ff8c00");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Main Card
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  roundRect(ctx, 20, 20, width - 40, height - 40, 20);
  ctx.fill();

  // Header
  ctx.fillStyle = "#ffa500";
  roundRect(ctx, 20, 20, width - 40, 60, 20);
  ctx.fill();

  // Title
  ctx.fillStyle = "#000000";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("📋 BANNED USERS LIST", width / 2, 55);

  // List Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("User ID", 50, 100);
  ctx.fillText("Name", 250, 100);
  ctx.fillText("Time Left", 500, 100);

  // Draw line
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 110);
  ctx.lineTo(width - 50, 110);
  ctx.stroke();

  // List Users
  let yPos = 140;
  ctx.font = "16px Arial";
  
  for (const user of bannedUsers) {
    ctx.fillStyle = "#ffffff";
    ctx.fillText(user.id, 50, yPos);
    ctx.fillText(user.name, 250, yPos);
    
    // Time calculation
    const timeLeft = user.banTime - Date.now();
    if (timeLeft > 0) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      ctx.fillStyle = "#ff4444";
      ctx.fillText(`${hours}h ${minutes}m`, 500, yPos);
    } else {
      ctx.fillStyle = "#00ff00";
      ctx.fillText("EXPIRED", 500, yPos);
    }
    
    yPos += 30;
  }

  // Footer
  ctx.fillStyle = "#cccccc";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Total Banned: ${bannedUsers.length} • Use "user unban [uid]" to unban`, width / 2, height - 30);

  return canvas.toBuffer("image/png");
}

// 🎯 MIRAI MAIN COMMAND HANDLER WITH UNBAN SYSTEM
module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  try {
    const command = args[0]?.toLowerCase();

    // 📊 STATUS COMMAND
    if (command === "status") {
      const warnings = userWarnings.get(senderID) || 0;
      const banTime = userBanned.get(senderID);
      const isBanned = banTime && Date.now() < banTime;
      
      let statusMessage = `🛡️ USER PROTECTION STATUS\n\n👤 User: ${senderID}\n⚠️ Warnings: ${warnings}/3\n`;
      
      if (isBanned) {
        const timeLeft = banTime - Date.now();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        statusMessage += `🔴 Status: BANNED\n⏰ Time Left: ${hours}h ${minutes}m\n\nContact admin for unban.`;
      } else {
        statusMessage += `🟢 Status: ACTIVE\n📊 Protection: ENABLED\n\nUse carefully to avoid auto-ban!`;
      }
      
      return api.sendMessage({ body: statusMessage }, threadID, messageID);
    }

    // 🔨 MANUAL BAN COMMAND (ADMIN ONLY)
    if (command === "ban" && args[1]) {
      // Check admin permissions
      if (!premiumUsers.has(senderID.toString())) {
        return api.sendMessage({
          body: "❌ Permission Denied! Only premium users can use this command."
        }, threadID, messageID);
      }

      const targetUID = args[1];
      const banDuration = parseInt(args[2]) || 24; // Default 24 hours
      const reason = args.slice(3).join(" ") || "Manual ban by admin";
      
      userBanned.set(targetUID, Date.now() + (banDuration * 60 * 60 * 1000));
      
      // Add to ban history
      banHistory.set(targetUID, {
        reason: reason,
        bannedBy: senderID,
        bannedAt: Date.now(),
        duration: banDuration
      });
      
      return api.sendMessage({
        body: `✅ User ${targetUID} has been manually banned for ${banDuration} hours.\n📝 Reason: ${reason}`
      }, threadID, messageID);
    }

    // 🔓 UNBAN COMMAND (ADMIN ONLY)
    if (command === "unban" && args[1]) {
      // Check admin permissions
      if (!premiumUsers.has(senderID.toString())) {
        return api.sendMessage({
          body: "❌ Permission Denied! Only premium users can unban users."
        }, threadID, messageID);
      }

      const targetUID = args[1];
      
      // Check if user is actually banned
      if (!userBanned.has(targetUID)) {
        return api.sendMessage({
          body: `❌ User ${targetUID} is not currently banned.`
        }, threadID, messageID);
      }

      // Get user info for card
      let userName = "Unknown User";
      try {
        const userInfo = await api.getUserInfo(targetUID);
        userName = userInfo[targetUID]?.name || "Unknown User";
      } catch (e) {
        userName = "User";
      }

      // Get admin name
      let adminName = "Admin";
      try {
        const adminInfo = await api.getUserInfo(senderID);
        adminName = adminInfo[senderID]?.name || "Admin";
      } catch (e) {
        adminName = "Admin";
      }

      // Unban the user
      userBanned.delete(targetUID);
      userWarnings.set(targetUID, 0); // Reset warnings
      
      // Create unban card
      const unbanCard = await createUnbanCard(userName, targetUID, adminName);
      const cardPath = path.join(CACHE_DIR, `unban_${targetUID}.png`);
      fs.writeFileSync(cardPath, unbanCard);
      
      return api.sendMessage({
        body: `✅ SUCCESS! User ${userName} (${targetUID}) has been unbanned.`,
        attachment: fs.createReadStream(cardPath)
      }, threadID, messageID);
    }

    // 📋 BANNED LIST COMMAND
    if (command === "list" || command === "banned") {
      // Check admin permissions for detailed list
      if (!premiumUsers.has(senderID.toString())) {
        return api.sendMessage({
          body: "❌ Permission Denied! Only premium users can view banned list."
        }, threadID, messageID);
      }

      const bannedUsers = [];
      
      // Get all currently banned users
      for (const [uid, banTime] of userBanned.entries()) {
        if (Date.now() < banTime) {
          let userName = "Unknown";
          try {
            const userInfo = await api.getUserInfo(uid);
            userName = userInfo[uid]?.name || "Unknown";
          } catch (e) {
            userName = "Unknown";
          }
          
          bannedUsers.push({
            id: uid,
            name: userName.length > 15 ? userName.substring(0, 15) + "..." : userName,
            banTime: banTime
          });
        } else {
          // Remove expired bans
          userBanned.delete(uid);
        }
      }
      
      if (bannedUsers.length === 0) {
        return api.sendMessage({
          body: "✅ No users are currently banned."
        }, threadID, messageID);
      }
      
      // Create banned list card
      const listCard = await createBannedListCard(bannedUsers);
      const cardPath = path.join(CACHE_DIR, `banned_list.png`);
      fs.writeFileSync(cardPath, listCard);
      
      return api.sendMessage({
        body: `📋 Currently Banned Users: ${bannedUsers.length}`,
        attachment: fs.createReadStream(cardPath)
      }, threadID, messageID);
    }

    // 🔄 AUTO UNBAN EXPIRED USERS
    if (command === "clean") {
      if (!premiumUsers.has(senderID.toString())) {
        return api.sendMessage({
          body: "❌ Permission Denied! Only premium users can clean expired bans."
        }, threadID, messageID);
      }

      let expiredCount = 0;
      for (const [uid, banTime] of userBanned.entries()) {
        if (Date.now() >= banTime) {
          userBanned.delete(uid);
          expiredCount++;
        }
      }
      
      return api.sendMessage({
        body: `🧹 Cleaned ${expiredCount} expired bans from the system.`
      }, threadID, messageID);
    }

    // ℹ️ HELP COMMAND
    return api.sendMessage({
      body: `🛡️ USER PROTECTION SYSTEM v6.0\n\nCommands:\n• user status - Check your protection status\n• user ban [uid] [hours] [reason] - Ban user (admin)\n• user unban [uid] - Unban user (admin)\n• user list - View banned users (admin)\n• user clean - Clean expired bans (admin)\n\nAuto-protection is active for abusive language and spam.`
    }, threadID, messageID);

  } catch (error) {
    console.error("Mirai Protection Error:", error);
    api.sendMessage("❌ System error in protection module.", threadID, messageID);
  }
};

// 🚨 MIRAI EVENT HANDLER FOR AUTO-PROTECTION
module.exports.handleEvent = async function({ event, api }) {
  try {
    const { senderID, body, threadID } = event;
    
    // Skip if message is empty or from premium user
    if (!body || premiumUsers.has(senderID.toString())) return;
    
    // Auto-clean expired bans first
    for (const [uid, banTime] of userBanned.entries()) {
      if (Date.now() >= banTime) {
        userBanned.delete(uid);
      }
    }
    
    // Check if user is banned
    const banTime = userBanned.get(senderID);
    if (banTime && Date.now() < banTime) {
      const timeLeft = banTime - Date.now();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      api.sendMessage({
        body: `❌ You are currently banned!\n⏰ Time Left: ${hours}h ${minutes}m\n📞 Contact admin for unban.`
      }, threadID);
      return;
    }

    const message = body.toLowerCase();
    
    // Detect violations
    let violation = null;
    
    // Check abusive words
    const hasAbuse = abuseWords.some(word => message.includes(word));
    if (hasAbuse) violation = "Abusive language";
    
    // Check protected names
    const hasProtectedName = protectedNames.some(name => message.includes(name));
    if (hasProtectedName) violation = "Protected name misuse";
    
    // Check spam
    const userData = spamUsers.get(senderID) || { count: 0, lastTime: 0 };
    const now = Date.now();
    if (now - userData.lastTime < 3000) { // 3 seconds
      userData.count++;
      if (userData.count > 3) violation = "Spam detection";
    } else {
      userData.count = 1;
    }
    userData.lastTime = now;
    spamUsers.set(senderID, userData);
    
    // Handle violation
    if (violation) {
      const currentWarnings = userWarnings.get(senderID) || 0;
      const newWarnings = currentWarnings + 1;
      userWarnings.set(senderID, newWarnings);
      
      if (newWarnings >= 3) {
        // BAN USER
        const userInfo = await api.getUserInfo(senderID);
        const userName = userInfo[senderID]?.name || "User";
        
        // 24 hour ban
        userBanned.set(senderID, Date.now() + 24 * 60 * 60 * 1000);
        userWarnings.set(senderID, 0); // Reset warnings
        
        // Add to ban history
        banHistory.set(senderID, {
          reason: violation,
          bannedBy: "AUTO-SYSTEM",
          bannedAt: Date.now(),
          duration: 24
        });
        
        api.sendMessage({
          body: `🚨 USER BANNED!\n📛 Name: ${userName}\n⏰ Duration: 24 hours\n🔨 Reason: ${violation}\n\nAdmin can unban using: user unban ${senderID}`
        }, threadID);
        
      } else {
        // WARNING
        api.sendMessage({
          body: `⚠️ WARNING ${newWarnings}/3\nReason: ${violation}\nNext violation will result in 24h ban!`
        }, threadID);
      }
    }
    
  } catch (error) {
    console.error("Mirai Auto-Protection Error:", error);
  }
};
