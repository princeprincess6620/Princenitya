const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Show BOT info + Owner card + Avatar + Buttons",
  commandCategory: "system",
  usages: "",
  cooldowns: 3
};

const TRIGGERS = ["prefix"];

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { body, threadID, senderID } = event;
  if (!body || !TRIGGERS.includes(body.trim().toLowerCase())) return;

  const ownerID = "61580003810694"; // your UID
  const ownerName = "ᴀʀʏᴀɴ 💛";
  const ownerBio = "𝑻𝒓𝒖𝒔𝒕 𝑴𝒆 𝑩𝒂𝒃𝒚 »» 𝑰 𝑾𝒊𝒍𝒍 𝑩𝒓𝒆𝒂𝒌 𝒀𝒐𝒖𝒓 𝑯𝒆𝒂𝒓𝒕 ✨";

  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  const fbProfile = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const fbInbox = `https://m.me/${ownerID}`;
  const imgPath = path.join(__dirname, `avt_${ownerID}.png`);

  const card = `『 BOT INFORMATION 』

👋 Hi ${await Users.getNameUser(senderID)}

🤖 Bot Name: ${global.config.BOTNAME}
🆔 Bot ID: ${api.getCurrentUserID()}

🔧 Prefix: ${global.config.PREFIX}
📚 Commands: ${global.client.commands.size}

👤 Total Users: ${global.data.allUserID.length}
💬 Total Threads: ${global.data.allThreadID.length}

👑 Bot Owner:
`;

  try {
    const img = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(img.data));

    await api.sendMessage({ body: card }, threadID);

    api.sendMessage({
      body: `${ownerName}\n${ownerBio}\nFacebook`,
      attachment: fs.createReadStream(imgPath),
      mentions: [{ tag: ownerName, id: ownerID }],
      buttons: [
        {
          type: "web_url",
          url: fbProfile,
          title: "Profile"
        },
        {
          type: "web_url",
          url: fbInbox,
          title: "Message"
        }
      ]
    }, threadID, () => fs.unlinkSync(imgPath));

  } catch (err) {
    console.log(err);
    api.sendMessage(`❌ Error: ${err.message}`, threadID);
  }
};

module.exports.run = async (o) => module.exports.handleEvent(o);
