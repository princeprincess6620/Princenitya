module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PriyanshuAi × Grok",
  description: "Exact 100% screenshot jaisa info card",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const ownerInfo = {
    name: "M.R LEGEND ARYAN",
    id: "61580003810694"  // ← YAHAN APNA REAL FB ID DAAL DO (ye wahi ID hai jo screenshot mein hai)
  };

  // First message - EXACT SAME CARD
  api.sendMessage({
    body: `┌─────❀ [ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ] ❀─────┐

Hi Kael Draven!

Bot Name: FB Bot
Bot ID: ${api.getCurrentUserID()}
Prefix: ${global.config.PREFIX}
Commands: 140 (407 with aliases)
Total Users: 6648
Total Threads: 53
Try typing ${global.config.PREFIX}help to see available commands!

Bot Owner:`
  }, event.threadID);

  // Second message - EXACT SAME FANCY OWNER TAG WITH PHOTO
  api.sendMessage({
    body: `Trust Me Baby♡ I Will ☠ Break Your Heart━━♡
${ownerInfo.name}
Facebook`,
    mentions: [{
      tag: ownerInfo.name,
      id: ownerInfo.id
    }]
  }, event.threadID, event.messageID);
};
