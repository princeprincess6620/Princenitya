// commands/user.js - 🔥 VIP PREMIUM SYSTEM
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "user",
  version: "🔥 VIP 3.0",
  hasPermssion: 1,
  credits: "⚡ ARYAN | VIP PREMIUM SYSTEM",
  description: "💎 VIP Protection System with Premium Features",
  commandCategory: "💼 System",
  cooldowns: 0
};

// 💎 VIP STORAGE SYSTEM
if (!global.VIPProtection) {
  global.VIPProtection = {
    userBanned: new Map(),
    vipAdmins: new Set([
      "61581359639498",  // 👑 MAIN VIP ADMIN (YOUR ID)
      "61581359639498",  // 💫 EXTRA VIP 1
      "61581359639498"   // 💫 EXTRA VIP 2
    ]),
    banHistory: new Map(),
    userStats: new Map()
  };
}

const { userBanned, vipAdmins, banHistory, userStats } = global.VIPProtection;

// 🚫 PREMIUM BAN WORDS
const vipBanWords = [
  "bsdk", "bhosdk", "madarchod", "bhenchod", "chutiya", 
  "mc", "bc", "loda", "randi", "fuck you", "motherfucker",
  "aryan sale", "bot chutiya", "aryan kamina", "owner chutiya",
];

// 🎨 VIP STYLISH MESSAGES
const vipStyles = {
  header: "✨⃝🅥🅘🅟⃝✨ •••••••••••••••••••••",
  footer: "••••••••••••••••••••• ✨⃝🅟🅡🅞🅣🅔🅒🅣🅘🅞🅝⃝✨",
  success: "✅",
  error: "❌",
  warning: "⚠️",
  admin: "👑",
  ban: "🔨",
  unban: "🔓",
  list: "📋",
  crown: "💎",
  rocket: "🚀",
  fire: "🔥",
  star: "⭐",
  shield: "🛡️"
};

// 💫 VIP COMMAND HANDLER
module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  try {
    const command = args[0]?.toLowerCase();
    const targetUID = args[1];

    // 🔥 VIP HELP COMMAND
    if (!command || command === "help") {
      let helpText = `${vipStyles.header}\n`;
      helpText += `      💎 𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓 𝐒𝐘𝐒𝐓𝐄𝐌 💎\n`;
      helpText += `${vipStyles.header}\n\n`;
      
      if (vipAdmins.has(senderID.toString())) {
        helpText += `${vipStyles.admin} 𝗩𝗜𝗣 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:\n\n`;
        helpText += `${vipStyles.unban}  user unban [UID]    → Unban user\n`;
        helpText += `${vipStyles.list}   user list           → Banned users\n`;
        helpText += `${vipStyles.crown}  user adminlist      → VIP Admins\n`;
        helpText += `${vipStyles.rocket} user stats [UID]    → User statistics\n`;
        
        if (senderID.toString() === "61581359639498") {
          helpText += `\n${vipStyles.fire} 𝗠𝗔𝗜𝗡 𝗩𝗜𝗣 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:\n\n`;
          helpText += `${vipStyles.star}  user addadmin [UID]  → Add VIP Admin\n`;
          helpText += `${vipStyles.star}  user removeadmin [UID] → Remove VIP\n`;
        }
        
        helpText += `\n${vipStyles.shield} 𝗔𝗨𝗧𝗢-𝗕𝗔𝗡 𝗪𝗢𝗥𝗗𝗦:\n`;
        helpText += `└─ ${vipBanWords.slice(0, 6).join(', ')}...\n`;
      } else {
        helpText += `${vipStyles.warning} 𝗕𝗔𝗦𝗜𝗖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:\n\n`;
        helpText += `${vipStyles.star} user help    → This menu\n`;
        helpText += `${vipStyles.star} user status  → Your status\n`;
        helpText += `\n${vipStyles.warning} VIP access required for admin commands\n`;
      }
      
      helpText += `\n${vipStyles.footer}`;
      return api.sendMessage(helpText, threadID, messageID);
    }

    // 🔓 VIP UNBAN COMMAND
    if (command === "unban" && targetUID) {
      if (!vipAdmins.has(senderID.toString())) {
        return sendErrorMessage(api, threadID, "VIP Access Required", "Only VIP admins can unban users");
      }

      if (userBanned.has(targetUID)) {
        userBanned.delete(targetUID);
        return sendSuccessMessage(api, threadID, 
          "USER UNBANNED", 
          `User ${targetUID} has been successfully unbanned\n${vipStyles.star} They can now use bot commands again`
        );
      } else {
        return sendErrorMessage(api, threadID, 
          "Not Banned", 
          `User ${targetUID} is not currently banned`
        );
      }
    }

    // 📋 VIP BANNED LIST
    if (command === "list" || command === "banned") {
      if (!vipAdmins.has(senderID.toString())) {
        return sendErrorMessage(api, threadID, "VIP Access Required", "Only VIP admins can view banned list");
      }

      const bannedUsers = [];
      let expiredCount = 0;

      for (const [uid, banTime] of userBanned.entries()) {
        if (Date.now() < banTime) {
          const hoursLeft = Math.ceil((banTime - Date.now()) / (1000 * 60 * 60));
          const minutesLeft = Math.ceil((banTime - Date.now()) / (1000 * 60)) % 60;
          
          try {
            const userInfo = await api.getUserInfo(uid);
            const userName = userInfo[uid]?.name || "Unknown User";
            bannedUsers.push({ uid, userName, hoursLeft, minutesLeft });
          } catch (e) {
            bannedUsers.push({ uid, userName: "Unknown User", hoursLeft, minutesLeft });
          }
        } else {
          userBanned.delete(uid);
          expiredCount++;
        }
      }

      if (bannedUsers.length === 0) {
        return sendSuccessMessage(api, threadID, 
          "CLEAN SLATE", 
          `No users are currently banned${expiredCount > 0 ? `\n${vipStyles.success} Auto-cleaned ${expiredCount} expired bans` : ''}`
        );
      }

      let listText = `${vipStyles.header}\n`;
      listText += `      📋 𝐕𝐈𝐏 𝐁𝐀𝐍𝐍𝐄𝐃 𝐋𝐈𝐒𝐓 📋\n`;
      listText += `${vipStyles.header}\n\n`;
      
      bannedUsers.forEach((user, index) => {
        listText += `${vipStyles.ban} 𝗨𝗦𝗘𝗥 ${index + 1}:\n`;
        listText += `┌─ 𝗡𝗮𝗺𝗲: ${user.userName}\n`;
        listText += `├─ 𝗜𝗗: ${user.uid}\n`;
        listText += `└─ 𝗧𝗶𝗺𝗲 𝗟𝗲𝗳𝘁: ${user.hoursLeft}h ${user.minutesLeft}m\n\n`;
      });

      listText += `${vipStyles.warning} 𝗨𝗦𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗:\n`;
      listText += `└─ user unban [UID]\n\n`;
      listText += `${vipStyles.footer}`;

      return api.sendMessage(listText, threadID, messageID);
    }

    // 👑 ADD VIP ADMIN
    if (command === "addadmin" && targetUID) {
      if (senderID.toString() !== "61581359639498") {
        return sendErrorMessage(api, threadID, 
          "Main VIP Required", 
          "Only Main VIP Admin can add new admins"
        );
      }

      vipAdmins.add(targetUID);
      return sendSuccessMessage(api, threadID, 
        "VIP ADMIN ADDED", 
        `User ${targetUID} has been promoted to VIP Admin\n${vipStyles.crown} They now have full admin privileges`
      );
    }

    // 🚫 REMOVE VIP ADMIN
    if (command === "removeadmin" && targetUID) {
      if (senderID.toString() !== "61581359639498") {
        return sendErrorMessage(api, threadID, 
          "Main VIP Required", 
          "Only Main VIP Admin can remove admins"
        );
      }

      if (vipAdmins.has(targetUID)) {
        vipAdmins.delete(targetUID);
        return sendSuccessMessage(api, threadID, 
          "VIP REMOVED", 
          `User ${targetUID} has been removed from VIP Admin list`
        );
      } else {
        return sendErrorMessage(api, threadID, 
          "Not VIP Admin", 
          `User ${targetUID} is not a VIP Admin`
        );
      }
    }

    // 💫 VIP ADMIN LIST
    if (command === "adminlist" || command === "vip") {
      if (!vipAdmins.has(senderID.toString())) {
        return sendErrorMessage(api, threadID, "VIP Access Required", "Only VIP admins can view this list");
      }

      const adminList = Array.from(vipAdmins);
      let adminText = `${vipStyles.header}\n`;
      adminText += `      👑 𝐕𝐈𝐏 𝐀𝐃𝐌𝐈𝐍 𝐋𝐈𝐒𝐓 👑\n`;
      adminText += `${vipStyles.header}\n\n`;
      
      adminList.forEach((uid, index) => {
        const isMain = uid === "61581359639498";
        adminText += `${isMain ? vipStyles.fire : vipStyles.crown} 𝗩𝗜𝗣 ${index + 1}:\n`;
        adminText += `└─ 𝗜𝗗: ${uid} ${isMain ? ' [MAIN VIP]' : ''}\n\n`;
      });

      adminText += `${vipStyles.star} 𝗧𝗼𝘁𝗮𝗹 𝗩𝗜𝗣𝘀: ${adminList.length}\n`;
      adminText += `\n${vipStyles.footer}`;

      return api.sendMessage(adminText, threadID, messageID);
    }

    // 📊 USER STATISTICS
    if (command === "stats" && targetUID) {
      if (!vipAdmins.has(senderID.toString())) {
        return sendErrorMessage(api, threadID, "VIP Access Required", "Only VIP admins can view statistics");
      }

      const userStat = userStats.get(targetUID) || { banCount: 0, lastBan: null, firstSeen: Date.now() };
      const isBanned = userBanned.has(targetUID) && Date.now() < userBanned.get(targetUID);
      
      let statsText = `${vipStyles.header}\n`;
      statsText += `      📊 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 📊\n`;
      statsText += `${vipStyles.header}\n\n`;
      
      statsText += `${vipStyles.shield} 𝗨𝗦𝗘𝗥 𝗜𝗗: ${targetUID}\n`;
      statsText += `${vipStyles.ban} 𝗕𝗮𝗻 𝗖𝗼𝘂𝗻𝘁: ${userStat.banCount} times\n`;
      statsText += `${vipStyles.warning} 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝘁𝗮𝘁𝘂𝘀: ${isBanned ? 'BANNED 🔴' : 'ACTIVE 🟢'}\n`;
      
      if (userStat.lastBan) {
        const lastBanDate = new Date(userStat.lastBan).toLocaleDateString();
        statsText += `${vipStyles.star} 𝗟𝗮𝘀𝘁 𝗕𝗮𝗻: ${lastBanDate}\n`;
      }
      
      statsText += `\n${vipStyles.footer}`;
      
      return api.sendMessage(statsText, threadID, messageID);
    }

    // 🎯 USER STATUS
    if (command === "status") {
      const isBanned = userBanned.has(senderID.toString()) && Date.now() < userBanned.get(senderID.toString());
      const isVIP = vipAdmins.has(senderID.toString());
      
      let statusText = `${vipStyles.header}\n`;
      statusText += `      🎯 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐔𝐒 🎯\n`;
      statusText += `${vipStyles.header}\n\n`;
      
      statusText += `${vipStyles.crown} 𝗩𝗜𝗣 𝗦𝘁𝗮𝘁𝘂𝘀: ${isVIP ? 'ACTIVE 💎' : 'NOT VIP ⚠️'}\n`;
      statusText += `${vipStyles.shield} 𝗕𝗮𝗻 𝗦𝘁𝗮𝘁𝘂𝘀: ${isBanned ? 'BANNED 🔴' : 'ACTIVE 🟢'}\n`;
      
      if (isBanned) {
        const banTime = userBanned.get(senderID.toString());
        const timeLeft = banTime - Date.now();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        statusText += `⏰ 𝗧𝗶𝗺𝗲 𝗟𝗲𝗳𝘁: ${hours}h ${minutes}m\n`;
      }
      
      statusText += `\n${vipStyles.warning} 𝗔𝗱𝘃𝗶𝗰𝗲: Avoid using prohibited words\n`;
      statusText += `\n${vipStyles.footer}`;
      
      return api.sendMessage(statusText, threadID, messageID);
    }

    // Default case
    return sendErrorMessage(api, threadID, 
      "Unknown Command", 
      `Use "user help" to see all available VIP commands`
    );

  } catch (error) {
    console.error("VIP System Error:", error);
    return sendErrorMessage(api, threadID, 
      "System Error", 
      "An error occurred in VIP system. Please try again."
    );
  }
};

// 🚀 VIP AUTO-BAN SYSTEM
module.exports.handleEvent = async function({ event, api }) {
  try {
    const { senderID, body, threadID, messageID } = event;

    // Skip if no message or VIP admin
    if (!body || vipAdmins.has(senderID.toString())) return;

    const uid = senderID.toString();
    const message = body.toLowerCase();

    // Check if already banned
    if (userBanned.has(uid) && Date.now() < userBanned.get(uid)) {
      const banTime = userBanned.get(uid);
      const timeLeft = banTime - Date.now();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      api.sendMessage({
        body: `${vipStyles.header}\n${vipStyles.error} 𝗬𝗢𝗨 𝗔𝗥𝗘 𝗕𝗔𝗡𝗡𝗘𝗗\n${vipStyles.header}\n\n` +
              `${vipStyles.warning} 𝗕𝗮𝗻 𝗧𝗶𝗺𝗲 𝗟𝗲𝗳𝘁: ${hours}h ${minutes}m\n` +
              `${vipStyles.star} 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗩𝗜𝗣 𝗔𝗱𝗺𝗶𝗻 𝗳𝗼𝗿 𝘂𝗻𝗯𝗮𝗻\n\n` +
              `${vipStyles.footer}`
      }, threadID, messageID);
      return;
    }

    // Clean expired ban
    if (userBanned.has(uid) && Date.now() >= userBanned.get(uid)) {
      userBanned.delete(uid);
    }

    // Check for banned words
    let foundWord = null;
    for (const word of vipBanWords) {
      if (message.includes(word)) {
        foundWord = word;
        break;
      }
    }

    if (foundWord) {
      // Update user stats
      const userStat = userStats.get(uid) || { banCount: 0, lastBan: null };
      userStat.banCount++;
      userStat.lastBan = Date.now();
      userStats.set(uid, userStat);

      // Ban user for 48 hours
      userBanned.set(uid, Date.now() + (48 * 60 * 60 * 1000));

      // Send VIP ban message
      const banMessage = `${vipStyles.header}\n` +
                        `      🚨 𝐕𝐈𝐏 𝐀𝐔𝐓𝐎-𝐁𝐀𝐍 🚨\n` +
                        `${vipStyles.header}\n\n` +
                        `${vipStyles.ban} 𝗥𝗲𝗮𝘀𝗼𝗻: Prohibited word "${foundWord}"\n` +
                        `${vipStyles.warning} 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: 48 Hours\n` +
                        `${vipStyles.star} 𝗨𝗻𝗯𝗮𝗻: user unban ${uid}\n\n` +
                        `${vipStyles.footer}`;

      await api.sendMessage({ body: banMessage }, threadID, messageID);
    }

  } catch (error) {
    console.error("VIP Auto-Ban Error:", error);
  }
};

// 💫 VIP HELPER FUNCTIONS
function sendSuccessMessage(api, threadID, title, message) {
  const successText = `${vipStyles.header}\n` +
                     `      ${vipStyles.success} ${title} ${vipStyles.success}\n` +
                     `${vipStyles.header}\n\n` +
                     `${message}\n\n` +
                     `${vipStyles.footer}`;
  
  return api.sendMessage(successText, threadID);
}

function sendErrorMessage(api, threadID, title, message) {
  const errorText = `${vipStyles.header}\n` +
                   `      ${vipStyles.error} ${title} ${vipStyles.error}\n` +
                   `${vipStyles.header}\n\n` +
                   `${message}\n\n` +
                   `${vipStyles.footer}`;
  
  return api.sendMessage(errorText, threadID);
}

// 🔥 MIRAI COMPATIBILITY
module.exports.run = module.exports.onStart;
