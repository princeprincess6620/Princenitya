// commands/user.js - FIXED WORKING VERSION
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "user",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "ARYAN",
  description: "User Protection System",
  commandCategory: "System",
  cooldowns: 0
};

// SIMPLE STORAGE - NO CANVAS
if (!global.userProtection) {
  global.userProtection = {
    userBanned: new Map(),
    userWarnings: new Map(),
    spamTracker: new Map(),
    adminUsers: new Set(["100000000000000"]) // YOUR FACEBOOK ID HERE
  };
}

const { userBanned, userWarnings, spamTracker, adminUsers } = global.userProtection;

// PROTECTION WORDS
const badWords = [
  "bsdk", "bhosdk", "madarchod", "bhenchod", "chutiya", 
  "mc", "bc", "gaand", "loda", "randi", "fuck you"
];

const protectedNames = ["aryan", "bot", "aryan bot", "owner"];

// ✅ MIRAI COMPATIBLE COMMAND HANDLER
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
        userWarnings.delete(targetUID);
        return api.sendMessage(`✅ User ${targetUID} has been unbanned.`, threadID, messageID);
      } else {
        return api.sendMessage(`❌ User ${targetUID} is not banned.`, threadID, messageID);
      }
    }
    
    // 📋 BANNED LIST
    if (command === "list") {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can view banned list.", threadID, messageID);
      }
      
      const bannedList = Array.from(userBanned.entries())
        .filter(([uid, time]) => Date.now() < time)
        .map(([uid, time]) => {
          const timeLeft = time - Date.now();
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          return `• ${uid} (${hours}h left)`;
        });
      
      if (bannedList.length === 0) {
        return api.sendMessage("✅ No users are currently banned.", threadID, messageID);
      }
      
      return api.sendMessage(
        `📋 Banned Users:\n${bannedList.join('\n')}\n\nUse "user unban UID" to unban.`,
        threadID, messageID
      );
    }
    
    // 📊 STATUS COMMAND
    if (command === "status") {
      const warnings = userWarnings.get(senderID) || 0;
      const isBanned = userBanned.has(senderID) && Date.now() < userBanned.get(senderID);
      
      let statusMsg = `🛡️ YOUR STATUS:\n\n⚠️ Warnings: ${warnings}/3\n`;
      
      if (isBanned) {
        const banTime = userBanned.get(senderID);
        const timeLeft = banTime - Date.now();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        statusMsg += `🔴 Status: BANNED\n⏰ Time Left: ${hours}h ${minutes}m`;
      } else {
        statusMsg += `🟢 Status: ACTIVE\n💡 Be careful with your language!`;
      }
      
      return api.sendMessage(statusMsg, threadID, messageID);
    }
    
    // 🧹 CLEAN EXPIRED BANS
    if (command === "clean") {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can clean bans.", threadID, messageID);
      }
      
      let expiredCount = 0;
      for (const [uid, time] of userBanned.entries()) {
        if (Date.now() >= time) {
          userBanned.delete(uid);
          expiredCount++;
        }
      }
      
      return api.sendMessage(`✅ Cleaned ${expiredCount} expired bans.`, threadID, messageID);
    }
    
    // ℹ️ HELP
    return api.sendMessage(
      `🛡️ USER PROTECTION COMMANDS:\n\n` +
      `• user status - Check your status\n` +
      `• user unban [UID] - Unban user (admin)\n` +
      `• user list - Banned users list (admin)\n` +
      `• user clean - Clean expired bans (admin)\n\n` +
      `Auto-ban triggers after 3 warnings for abusive language.`,
      threadID, messageID
    );
    
  } catch (error) {
    console.error("User command error:", error);
    api.sendMessage("❌ Command error.", threadID, messageID);
  }
};

// ✅ MIRAI COMPATIBLE EVENT HANDLER - YAHI BAN KAREGA
module.exports.handleEvent = async function({ event, api }) {
  try {
    const { senderID, body, threadID, messageID } = event;
    
    // Skip if no message or from admin
    if (!body || adminUsers.has(senderID.toString())) return;
    
    const message = body.toLowerCase();
    const uid = senderID.toString();
    
    // 🚫 CHECK IF USER IS ALREADY BANNED
    if (userBanned.has(uid)) {
      const banTime = userBanned.get(uid);
      if (Date.now() < banTime) {
        // Still banned - prevent messaging
        api.sendMessage({
          body: `❌ You are banned from using commands.`
        }, threadID, messageID);
        return;
      } else {
        // Ban expired - remove
        userBanned.delete(uid);
      }
    }
    
    // 🔍 CHECK FOR VIOLATIONS
    let violation = null;
    
    // Check bad words
    const hasBadWord = badWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(message);
    });
    
    if (hasBadWord) violation = "Abusive language";
    
    // Check protected names
    const hasProtectedName = protectedNames.some(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      return regex.test(message);
    });
    
    if (hasProtectedName) violation = "Protected name misuse";
    
    // Check spam
    const userData = spamTracker.get(uid) || { count: 0, lastTime: 0 };
    const now = Date.now();
    
    if (now - userData.lastTime < 2000) { // 2 seconds
      userData.count++;
      if (userData.count > 4) {
        violation = "Spam detection";
      }
    } else {
      userData.count = 1;
    }
    userData.lastTime = now;
    spamTracker.set(uid, userData);
    
    // 🚨 HANDLE VIOLATION
    if (violation) {
      const currentWarnings = userWarnings.get(uid) || 0;
      const newWarnings = currentWarnings + 1;
      userWarnings.set(uid, newWarnings);
      
      if (newWarnings >= 3) {
        // 🔨 BAN THE USER - 24 HOURS
        const banDuration = 24 * 60 * 60 * 1000; // 24 hours
        userBanned.set(uid, Date.now() + banDuration);
        userWarnings.set(uid, 0); // Reset warnings
        
        // Get user name for message
        let userName = "User";
        try {
          const userInfo = await api.getUserInfo(uid);
          userName = userInfo[uid]?.name || "User";
        } catch (e) {
          // If can't get name, use UID
          userName = "User";
        }
        
        // Send ban message
        api.sendMessage({
          body: `🚨 USER BANNED!\n\n` +
                `📛 Name: ${userName}\n` +
                `🆔 ID: ${uid}\n` +
                `⏰ Duration: 24 hours\n` +
                `🔨 Reason: ${violation}\n\n` +
                `Admin can unban using: user unban ${uid}`
        }, threadID, messageID);
        
        console.log(`[AUTO-BAN] User ${uid} banned for ${violation}`);
        
      } else {
        // ⚠️ WARNING MESSAGE
        api.sendMessage({
          body: `⚠️ WARNING ${newWarnings}/3\n\n` +
                `Reason: ${violation}\n` +
                `Next violation will result in 24h ban!\n\n` +
                `Check your status: user status`
        }, threadID, messageID);
      }
    }
    
  } catch (error) {
    console.error("Auto-protection error:", error);
  }
};

// ✅ MIRAI COMPATIBLE - NO EXTRA EXPORTS
module.exports.run = module.exports.onStart;
