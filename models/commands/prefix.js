const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Owner Facebook Display Card",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Users }) => {

  const ownerID = "61580003810694"; // <-- Apna UID
  const ownerName = "『 💛 ARYAN 💛 』"; // <-- Apna fancy name
  const ownerBio =
    "𝑻𝒓𝒖𝒔𝒕 𝑴𝒆 𝑩𝒂𝒃𝒚 »» 𝑰 𝑾𝒊𝒍𝒍 𝑩𝒓𝒆𝒂𝒌 𝒀𝒐𝒖𝒓 𝑯𝒆𝒂𝒓𝒕 ✨";

  const avatarURL = `https://graph.facebook.com/${ownerID}/picture?width=720&height=720`;
  const fbProfile = `https://www.facebook.com/profile.php?id=${ownerID}`;
  const fbInbox = `https://m.me/${ownerID}`;

  const imgPath = path.join(__dirname, "owner.jpg");
  const imgData = await axios.get(avatarURL, { responseType: "arraybuffer" });
  fs.writeFileSync(imgPath, Buffer.from(imgData.data));

  api.sendMessage(
    {
      body:
        "『 BOT INFORMATION 』\n\n" +
        "👑 Bot Owner:\n\n" +
        `${ownerName}\n${ownerBio}\nFacebook`,
      attachment: fs.createReadStream(imgPath),
      buttons: [
        { url: fbProfile, title: "Profile" },
        { url: fbInbox, title: "Message" }
      ]
    },
    event.threadID,
    () => fs.unlinkSync(imgPath)
  );
};
