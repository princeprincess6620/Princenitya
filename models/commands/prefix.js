const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Premium Profile Card",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Users }) => {
  const uid = "61580003810694"; // <---- Yaha apna UID
  const fbName = "『 🖤 𝑨𝒓𝒚𝒂𝒏 𝑩𝒂𝒃𝒚 💛 』"; // <---- Apna Name
  const bio =
    "𝑻𝒓𝒖𝒔𝒕 𝑴𝒆 𝑩𝒂𝒃𝒚 »» 𝑰 𝑾𝒊𝒍𝒍 𝑩𝒓𝒆𝒂𝒌 𝒀𝒐𝒖𝒓 𝑯𝒆𝒂𝒓𝒕 ✨"; // Stylish line

  const avatar = `https://graph.facebook.com/${uid}/picture?width=720&height=720`;
  const fbProfile = `https://www.facebook.com/profile.php?id=${uid}`;
  const fbInbox = `https://m.me/${uid}`;

  const imgPath = path.join(__dirname, "pfp.jpg");
  const getImg = await axios.get(avatar, { responseType: "arraybuffer" });
  fs.writeFileSync(imgPath, Buffer.from(getImg.data));

  api.sendMessage(
    {
      body:
        "『 BOT INFORMATION 』\n\n" +
        "👑 Bot Owner:\n\n" +
        `${fbName}\n${bio}\nFacebook`,
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
