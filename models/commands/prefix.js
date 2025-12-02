const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show bot info + owner FB avatar (works on typing Prefix)",
  commandCategory: "system",
  usages: "Prefix (or .prefix)",
  cooldowns: 3
};

const TRIGGERS = ["prefix"];

async function downloadImage(url, savePath) {
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
  fs.writeFileSync(savePath, Buffer.from(res.data));
}

async function sendOwnerCard(api, threadID, senderID, opts = {}) {
  const {
    ownerID = "61580003810694",
    ownerName = "ᴀʀʏᴀɴ 💛",
    ownerBio = "𝑻𝒓𝒖𝒔𝒕 𝑴𝒆 𝑩𝒂𝒃𝒚 »» 𝑰 𝑾𝒊𝒍𝒍 𝑩𝒓𝒆𝒂𝒌 𝒀𝒐𝒖𝒓 𝑯𝒆𝒂𝒓𝒕 ✨"
  } = opts;

  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  const fbProfile = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const fbInbox = `https://m.me/${ownerID}`;

  const imgPath = path.join(__dirname, `owner_${ownerID}.jpg`);

  try {
    await downloadImage(avatarURL, imgPath);
  } catch (err) {
    // If image download fails, send a text error and continue without attachment
    api.sendMessage(`⚠️ Unable to download owner avatar: ${err.message}`, threadID);
    // fallback: send a plain card without image
    return api.sendMessage({
      body:
        "『 BOT INFORMATION 』\n\n" +
        `👑 Bot Owner:\n${ownerName}\n${ownerBio}\nFacebook\n\nProfile: ${fbProfile}\nMessage: ${fbInbox}`
    }, threadID);
  }

  // Compose main info card
  const card =
    "『 BOT INFORMATION 』\n\n" +
    `👋 Hi ${senderID ? "Facebook user" : "User"}!\n\n` +
    `🤖 Bot Name: ${global.config && global.config.BOTNAME ? global.config.BOTNAME : "FB Bot"}\n` +
    `🆔 Bot ID: ${api.getCurrentUserID ? api.getCurrentUserID() : "N/A"}\n\n` +
    `🔧 Prefix: ${global.config && global.config.PREFIX ? global.config.PREFIX : "/"}\n` +
    `📚 Commands: ${global.client && global.client.commands ? global.client.commands.size : "N/A"}\n\n` +
    `👑 Bot Owner:\n`;

  // Send the card text first (ensures layout like your screenshot)
  await new Promise((res) =>
    api.sendMessage({ body: card }, threadID, (err) => {
      if (err) console.error("ERR sending card text:", err);
      res();
    })
  );

  // Then send owner block with image + buttons (so image shows properly)
  const ownerMsg = {
    body: `${ownerName}\n${ownerBio}\nFacebook`,
    attachment: fs.createReadStream(imgPath),
    buttons: [
      { url: fbProfile, title: "Profile" },
      { url: fbInbox, title: "Message" }
    ],
    mentions: [{ tag: ownerName, id: ownerID }]
  };

  api.sendMessage(ownerMsg, threadID, (err) => {
    if (err) {
      console.error("ERR sending owner block:", err);
      api.sendMessage(`❌ Error sending owner card: ${err.message}`, threadID);
    }
    // cleanup cached image
    try {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    } catch (e) {
      console.warn("Failed to delete temp avatar:", e);
    }
  });
}

// handleEvent: listens for raw messages (typing "Prefix")
module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { body, threadID, senderID } = event;
    if (!body) return;
    const text = body.toString().trim().toLowerCase();
    if (!TRIGGERS.includes(text)) return;

    // send card
    await sendOwnerCard(api, threadID, senderID, {
      ownerID: "61580003810694",
      ownerName: "ᴀʀʏᴀɴ 💛",
      ownerBio: "𝑻𝒓𝒖𝒔𝒕 𝑴𝒆 𝑩𝒂𝒃𝒚 »» 𝑰 𝑾𝒊𝒍𝒍 𝑩𝒓𝒆𝒂𝒌 𝒀𝒐𝒖𝒓 𝑯𝒆𝒂𝒓𝒕 ✨"
    });
  } catch (err) {
    console.error("handleEvent error:", err);
  }
};

// run: when someone executes as a normal command (like .prefix)
module.exports.run = async ({ api, event }) => {
  try {
    await sendOwnerCard(api, event.threadID, event.senderID, {
      ownerID: "61580003810694",
      ownerName: "ᴀʀʏᴀɴ 💛",
      ownerBio: "𝑻𝒓𝒖𝒔𝒕 𝑴𝒆 𝑩𝒂𝒃𝒚 »» 𝑰 𝑾𝒊𝒍𝒍 𝑩𝒓𝒆𝒂𝒌 𝒀𝒐𝒖𝒓 𝑯𝒆𝒂𝒓𝒕 ✨"
    });
  } catch (err) {
    console.error("run error:", err);
    api.sendMessage("❌ Unexpected error while running prefix command.", event.threadID);
  }
};
