const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "xxxgif",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Original by Raj | Fixed by Nobita",
  description: "Send random NSFW gif",
  commandCategory: "18+",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const links = [
    "https://i.postimg.cc/7hfbxttJ/39951141.gif",
    "https://i.postimg.cc/T3ySrVFj/21153541.gif",
    "https://i.postimg.cc/pLt8Zx10/27079421.gif",
    "https://i.postimg.cc/cL4fb33v/41176981.gif",
    "https://i.postimg.cc/j2mBFTg5/18596611.gif",
    "https://i.postimg.cc/YChzSgCJ/10608452.gif",
    "https://i.postimg.cc/fRN58kzF/12573981.gif",
    "https://i.postimg.cc/Zq3b47t0/15635492.gif",
    "https://i.postimg.cc/L660SJK1/23034381.gif",
    "https://i.postimg.cc/D0X2xxvq/porn-gif-magazine-nastiest73.gif",
    "https://i.postimg.cc/MHKLTT4X/kiera-winters-cum-facial-fuck-gif-003.gif",
    "https://i.postimg.cc/Z5rxGm7Q/38518836005d1642c60e.gif",
    "https://i.postimg.cc/T1b6VQGB/pussy-penetration-001.gif",
    "https://i.postimg.cc/W13Fv8Tr/EC42C4B.gif",
    "https://i.postimg.cc/Jnw50vzS/CB6A914.gif",
    "https://i.postimg.cc/Gpvs72bS/BFF8AE3.gif",
    "https://i.postimg.cc/cCGWDx4T/DCE353A.gif",
    "https://i.postimg.cc/pX979bWL/878345.gif",
    "https://i.postimg.cc/hvw7f7SM/tetona-001-21.gif",
    "https://i.postimg.cc/02V9dqDR/blowjob-by-mouthfuckgif.gif",
    "https://i.postimg.cc/T2kst279/lesbo-at-sexylesby.gif",
    "https://i.postimg.cc/C5jsTNCk/teen-via-nsfwforsure.gif",
    "https://i.postimg.cc/j2sL240z/pounding-via-porngifjunkie.gif",
    "https://i.postimg.cc/nL4mLz9f/3471133-porn-gif-magazine-nastiest-001-1.gif",
    "https://i.postimg.cc/wvJ9zy1D/autumn-falls-amateurallure-doggystyle-sex.gif"
  ];

  try {
    const randomLink = links[Math.floor(Math.random() * links.length)];
    const extension = randomLink.split(".").pop();
    const fileName = `gif_${Date.now()}.${extension}`;
    const cachePath = __dirname + "/cache/";
    const filePath = cachePath + fileName;

    // Ensure cache directory exists
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }

    // Download the file using axios
    const response = await axios({
      method: "GET",
      url: randomLink,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `💦 Here's your NSFW gif, Daddy 😏`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, (err) => {
        if (err) console.error("Send message error:", err);
        
        // Clean up file after sending
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      });
    });

    writer.on("error", (err) => {
      console.error("Write stream error:", err);
      api.sendMessage("❌ Error downloading the GIF. Please try again.", event.threadID, event.messageID);
    });

  } catch (error) {
    console.error("Main error:", error);
    api.sendMessage("❌ An error occurred while processing your request.", event.threadID, event.messageID);
  }
};
