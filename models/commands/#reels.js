const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "reels",
  credits: "ARYAN",
  hasPermission: 0,
  description: "Instagram Reels Video Downloader/Search",
  usages: "[कीवर्ड/लिंक]",
  commandCategory: "media",
  cooldowns: 5
};

module.exports.run = async ({ event, args, api }) => {
  try {
    if (args.length === 0) {
      return api.sendMessage("⚠️ कृपया कोई कीवर्ड या Instagram Reels लिंक दें!", event.threadID, event.messageID);
    }

    let query = args.join(" ");
    let searchURL = `https://prince-sir-all-in-one-api.vercel.app/api/search/insta?search=${encodeURIComponent(query)}`;

    let searchResponse = await axios.get(searchURL);

    if (!searchResponse.data.data || searchResponse.data.data.length === 0) {
      return api.sendMessage("❌ कोई Reels वीडियो नहीं मिला!", event.threadID, event.messageID);
    }

    let videoData = searchResponse.data.data[0]; 
    let videoURL = videoData.url; 
    let videoTitle = videoData.title || "Instagram Reels";

    let filePath = `./reels_${event.senderID}.mp4`;
    let writer = fs.createWriteStream(filePath);

    let videoStream = await axios({
      url: videoURL,
      method: "GET",
      responseType: "stream"
    });

    videoStream.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `🎬 ${videoTitle}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    });

  } catch (error) {
    console.error(error);
    api.sendMessage("⚠️ Reels डाउनलोड करने में समस्या हुई!", event.threadID, event.messageID);
  }
};
