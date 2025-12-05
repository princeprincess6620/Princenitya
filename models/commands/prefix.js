module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Priyanshu × Grok",
  description: "Exact uske jaisa info card with links + Love ID added",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const ownerID = "61580003810694"; // ← Tera Love ID yahan add ho gaya (sirf number)
  const ownerName = "#◈♡✺⃪꯭ ꯭⎯꯭̎𝆺꯭𝅥😘😈⃝⃝〭A͌͢ʀ͜͡ƴʌ͢͡ŋͯ Owɭıı'x°❈°╿✺♡۞⚚◎𝆺꯭𝅥⎯꯭̽⟶᯦꯭⚘◈🩷🪿󱢏󱢏"; // ← Tera fancy profile name (agar simple chahiye to "ARYAN" kar de)

  const fbLink = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const messLink = `https://m.me/${ownerID}`;

  api.sendMessage({
    body: `┌────── ❀ OWNER NAME ❀ ──────┐
Tust Me Bağlı, I Will İşde Bıçak Yolu Heti

👑 Owner: ${ownerName}

┌──── ❀ CONTACT LINKS ❀ ────┐
📌 Facebook Profile
${fbLink}

✉️ Message on Messenger
${messLink}

┌──── ❀ BOT INFORMATION ❀ ────┐
🤖 Bot Name: FB Bot
🎭 Prefix: ${global.config.PREFIX}
📚 Commands: 140 (407 with aliases)
👥 Total Users: 6648
💬 Total Threads: 53

💡 Hint: ${global.config.PREFIX}help - All commands dekhein

⚠️ Note: Agar koi problem hai to direct message karein!`,
    mentions: []
  }, event.threadID);
};
