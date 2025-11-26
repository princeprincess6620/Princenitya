// commands/user.js - SIMPLE WORKING VERSION
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "user",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "ARYAN",
  description: "Instant Ban System",
  commandCategory: "System",
  cooldowns: 0
};

// SIMPLE STORAGE
if (!global.userProtection) {
  global.userProtection = {
    userBanned: new Map(),
    adminUsers: new Set(["100000000000000"]) // YOUR FACEBOOK ID
  };
}

const { userBanned, adminUsers } = global.userProtection;

// INSTANT BAN WORDS
const instantBanWords = [
  "bsdk", "bhosdk", "madarchod", "bhenchod", "chutiya", 
  "mc", "bc", "loda", "randi", "fuck you",
  "aryan", "bot", "aryan bot", "owner"
];

// ✅ SIMPLE MIRAI HANDLER
module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  try {
    const command = args[0]?.toLowerCase();

    // UNBAN COMMAND
    if (command === "unban" && args[1]) {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can unban users.", threadID, messageID);
      }

      const targetUID = args[1];
      if (userBanned.has(targetUID)) {
        userBanned.delete(targetUID);
        return api.sendMessage(`✅ User ${targetUID} has been unbanned.`, threadID, messageID);
      } else {
        return api.sendMessage(`❌ User ${targetUID} is not banned.`, threadID, messageID);
      }
    }

    // BANNED LIST
    if (command === "list") {
      if (!adminUsers.has(senderID.toString())) {
        return api.sendMessage("❌ Only admin can view banned list.", threadID, messageID);
      }

      const bannedList = [];
      for (const [uid, time] of userBanned.entries()) {
        if (Date.now() < time) {
          const hoursLeft = Math.ceil((time - Date.now()) / (1000 * 60 * 60));
          bannedList.push(`• ${uid} (${hoursLeft}h left)`);
        } else {
          userBanned.delete(uid);
        }
      }

      if (bannedList.length === 0) {
        return api.sendMessage("✅ No users are currently banned.", threadID, messageID);
      }

      return api.sendMessage(
        `📋 Banned Users:\n${bannedList.join('\n')}\n\nUse "user unban UID" to unban.`,
        threadID, messageID
      );
    }

    // HELP
    return api.sendMessage(
      `🛡️ INSTANT BAN SYSTEM\n\nCommands:\n• user unban [UID] - Unban user (admin)\n• user list - Banned users (admin)\n\nAuto-ban for: ${instantBanWords.slice(0, 5).join(', ')}...`,
      threadID, messageID
    );

  } catch (error) {
    console.error("Command error:", error);
    api.sendMessage("❌ System error.", threadID, messageID);
  }
};

// ✅ SIMPLE EVENT HANDLER - NO CANVAS
module.exports.handleEvent = async function({ event, api }) {
  try {
    const { senderID, body, threadID, messageID } = event;

    console.log(`[DEBUG] Message received: ${body}`);

    // SKIP IF NO MESSAGE OR ADMIN
    if (!body) {
      console.log("[DEBUG] Skipping: No message body");
      return;
    }

    if (adminUsers.has(senderID.toString())) {
      console.log("[DEBUG] Skipping: Admin user");
      return;
    }

    const uid = senderID.toString();
    const message = body.toLowerCase();

    console.log(`[DEBUG] Checking message: "${message}" from user: ${uid}`);

    // CHECK IF ALREADY BANNED
    if (userBanned.has(uid)) {
      const banTime = userBanned.get(uid);
      if (Date.now() < banTime) {
        console.log(`[DEBUG] User ${uid} is already banned`);
        api.sendMessage({
          body: `❌ You are banned for 48 hours. Contact admin.`
        }, threadID, messageID);
        return;
      } else {
        userBanned.delete(uid);
        console.log(`[DEBUG] Ban expired for user ${uid}`);
      }
    }

    // CHECK FOR BANNED WORDS
    let foundWord = null;
    for (const word of instantBanWords) {
      if (message.includes(word)) {
        foundWord = word;
        break;
      }
    }

    if (foundWord) {
      console.log(`[BAN TRIGGERED] Word found: "${foundWord}" from user ${uid}`);

      try {
        // GET USER INFO
        const userInfo = await api.getUserInfo(uid);
        const userName = userInfo[uid]?.name || "User";
        
        console.log(`[BAN] Banning user: ${userName} (${uid}) for word: ${foundWord}`);

        // BAN USER FOR 48 HOURS
        userBanned.set(uid, Date.now() + (48 * 60 * 60 * 1000));

        // SEND BAN MESSAGE
        await api.sendMessage({
          body: `🚨 INSTANT BAN APPLIED!\n\n` +
                `📛 User: ${userName}\n` +
                `🆔 ID: ${uid}\n` +
                `⏰ Duration: 48 HOURS\n` +
                `🔨 Reason: Used prohibited word "${foundWord}"\n\n` +
                `Admin can unban using: user unban ${uid}`
        }, threadID, messageID);

        console.log(`[SUCCESS] User ${uid} instantly banned`);

      } catch (error) {
        console.error("Ban process error:", error);
        // FALLBACK BAN
        userBanned.set(uid, Date.now() + (48 * 60 * 60 * 1000));
        api.sendMessage({
          body: `🚨 INSTANT BAN!\n\nYou used prohibited content.\nBan: 48 hours\nUse: user unban ${uid} (admin only)`
        }, threadID, messageID);
      }
    } else {
      console.log(`[DEBUG] No banned words found in message`);
    }

  } catch (error) {
    console.error("Event handler error:", error);
  }
};

// MIRAI COMPATIBILITY
module.exports.run = module.exports.onStart;
